import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';

interface SessionState {
  buffer: string;
  userId?: string;
  labId?: string;
  commandsRun?: string[];
}

const generateId = (len = 12) => Math.random().toString(16).slice(2, 2 + len);

@WebSocketGateway({
  namespace: 'terminal',
  cors: { origin: '*' },
})
export class TerminalGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private sessions: Map<string, SessionState> = new Map();

  constructor(private usersService: UsersService) {}

  handleConnection(client: Socket) {
    this.sessions.set(client.id, { buffer: '' });
  }

  handleDisconnect(client: Socket) {
    this.sessions.delete(client.id);
  }

  getSessionByUserId(userId: string): SessionState | null {
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        return session;
      }
    }
    return null;
  }

  @SubscribeMessage('start_session')
  handleStartSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { labId: string; userId?: string },
  ) {
    const session = this.sessions.get(client.id);
    if (session) {
      session.labId = data.labId;
      session.userId = data.userId;
    }
    client.emit('output', 'root@dlp-lab-env:~# ');
  }

  @SubscribeMessage('input')
  handleInput(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    const session = this.sessions.get(client.id);
    if (!session) return;

    // Handle Ctrl+C
    if (data === '\u0003') {
      client.emit('output', '^C\r\nroot@dlp-lab-env:~# ');
      session.buffer = '';
      return;
    }

    // Handle Backspace / Ctrl+H
    if (data === '\u007f' || data === '\b') {
      if (session.buffer.length > 0) {
        session.buffer = session.buffer.slice(0, -1);
        client.emit('output', '\b \b');
      }
      return;
    }

    if (data.includes('\r')) {
      const parts = data.split('\r');
      for (let i = 0; i < parts.length - 1; i++) {
        session.buffer += parts[i];
        client.emit('output', parts[i] + '\r\n');

        const rawCmd = session.buffer;
        session.buffer = '';
        this.executeCommand(client, session, rawCmd);
      }
      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        session.buffer += lastPart;
        client.emit('output', lastPart);
      }
    } else {
      if (data.startsWith('\x1b[')) return; // Ignore unhandled escape sequences (like arrows)
      session.buffer += data;
      client.emit('output', data);
    }
  }

  private async executeCommand(client: Socket, session: SessionState, rawCmd: string) {
    // eslint-disable-next-line no-control-regex
    const cleanCmd = rawCmd
      .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
      .replace(/[^\x20-\x7E]/g, '')
      .trim();

    if (!cleanCmd) {
      client.emit('output', 'root@dlp-lab-env:~# ');
      return;
    }

    session.commandsRun = session.commandsRun || [];
    session.commandsRun.push(cleanCmd);

    const output = this.simulateCommand(cleanCmd);

    setTimeout(() => {
      client.emit('output', output + '\r\nroot@dlp-lab-env:~# ');
    }, 300);
  }

  private simulateCommand(cmd: string): string {
    const args = cmd.split(' ').filter(Boolean);
    const main = args[0];

    const handlers: Record<string, () => string> = {
      docker: () => this.handleDocker(args),
      'docker-compose': () => this.handleDockerCompose(args),
      kubectl: () => this.handleKubectl(args),
      helm: () => this.handleHelm(args),
      ls: () => `app  bin  boot  dev  etc  home  lib  media  mnt  opt  root  run  sbin  srv  sys  tmp  usr  var`,
      pwd: () => `/root`,
      echo: () => args.slice(1).join(' '),
      clear: () => '\\x1b[2J\\x1b[3J\\x1b[H',
      cat: () => this.handleCat(args),
      whoami: () => `root`,
      hostname: () => `dlp-lab-env`,
      date: () => new Date().toUTCString(),
      uname: () => `Linux dlp-lab-env 5.15.0 #1 SMP x86_64 GNU/Linux`,
      ping: () => `PING ${args[1] || 'localhost'} (172.17.0.2): 56 data bytes\r\n64 bytes from 172.17.0.2: seq=0 ttl=64 time=0.087 ms\r\n64 bytes from 172.17.0.2: seq=1 ttl=64 time=0.075 ms\r\n--- ${args[1] || 'localhost'} ping statistics ---\r\n2 packets transmitted, 2 packets received, 0% packet loss`,
      curl: () => `<!DOCTYPE html>\r\n<html><head><title>Welcome to nginx!</title></head>\r\n<body><h1>Welcome to nginx!</h1></body></html>`,
      help: () => `Available commands: docker, docker-compose, kubectl, helm, ls, pwd, echo, cat, clear, ping, curl, whoami, hostname, date, uname`,
    };

    // Forward "docker compose" to the compose handler
    if (main === 'docker' && args[1] === 'compose') {
      return this.handleDockerCompose(['docker-compose', ...args.slice(2)]);
    }

    return handlers[main] ? handlers[main]() : `bash: ${main}: command not found`;
  }

  private handleCat(args: string[]): string {
    if (args[1] === 'Dockerfile') return `FROM node:18-alpine\r\nWORKDIR /app\r\nCOPY package*.json ./\r\nRUN npm ci --only=production\r\nCOPY . .\r\nEXPOSE 3000\r\nCMD ["node", "server.js"]`;
    if (['docker-compose.yml', 'compose.yml'].includes(args[1])) return `version: '3.8'\r\nservices:\r\n  web:\r\n    build: .\r\n    ports:\r\n      - "3000:3000"\r\n  db:\r\n    image: postgres:15\r\n    environment:\r\n      POSTGRES_PASSWORD: secret`;
    return `cat: ${args[1]}: No such file or directory`;
  }

  private handleDocker(args: string[]): string {
    const sub = args[1];
    
    switch (sub) {
      case 'pull':
        const img = args[2] || 'latest';
        return `Using default tag: latest\r\nlatest: Pulling from library/${img}\r\nc1ec31eb5944: Pull complete \r\nDigest: sha256:53641cd209a4fecfc68e21a99871ce8c6920b2e7502df0a20671c6fccc73a7c6\r\nStatus: Downloaded newer image for ${img}:latest\r\ndocker.io/library/${img}:latest`;
      
      case 'run':
        const imgIdx = args.findIndex((a, i) => i > 1 && !a.startsWith('-') && !['-p', '-v', '--name', '--user', '--network', '-e', '-w'].includes(args[i - 1]));
        const runImg = imgIdx >= 0 ? args[imgIdx] : 'unknown';
        if (runImg === 'hello-world') return `\r\nHello from Docker!\r\nThis message shows that your installation appears to be working correctly.\r\n\x1b[1;32m[SUCCESS] Container ran successfully.\x1b[0m`;
        const cid = generateId();
        if (runImg.includes('nginx') || runImg.includes('httpd')) return `${cid}\r\n\x1b[1;32m[SUCCESS] Container started in ${args.includes('-d') ? 'detached' : 'foreground'} mode.\x1b[0m`;
        return cid;

      case 'ps':
        return args.includes('-a') 
          ? `CONTAINER ID   IMAGE          COMMAND       CREATED          STATUS                     PORTS     NAMES\r\na1b2c3d4e5f6   nginx:latest   "/docker-…"   2 minutes ago    Up 2 minutes               80/tcp    web-server\r\nf6e5d4c3b2a1   hello-world    "/hello"      5 minutes ago    Exited (0) 5 minutes ago              keen_euler`
          : `CONTAINER ID   IMAGE          COMMAND       CREATED         STATUS         PORTS     NAMES\r\na1b2c3d4e5f6   nginx:latest   "/docker-…"   2 minutes ago   Up 2 minutes   80/tcp    web-server`;

      case 'images':
        return `REPOSITORY    TAG       IMAGE ID       CREATED        SIZE\r\nnginx         latest    a6bd71f48f68   2 days ago     187MB\r\nhello-world   latest    9c7a54a9a43c   3 months ago   13.3kB\r\nnode          18-alpine 9f1503cb306a   1 week ago     172MB`;

      case 'build':
        const tagName = args.includes('-t') ? args[args.indexOf('-t') + 1] : 'app';
        const targetIdx = args.indexOf('--target');
        const stages = targetIdx >= 0 ? `Step 1/5 : FROM node:18-alpine AS ${args[targetIdx + 1]}` : 'Step 1/3 : FROM node:18-alpine';
        return `Sending build context to Docker daemon  4.096kB\r\n${stages}\r\n ---> 9f1503cb306a\r\nStep 2/3 : WORKDIR /app\r\n ---> Running in 2b6e1a4f0010\r\nRemoving intermediate container 2b6e1a4f0010\r\n ---> c71775f0a0c6\r\nStep 3/3 : COPY . .\r\n ---> 23075c3f8f11\r\nSuccessfully built 23075c3f8f11\r\nSuccessfully tagged ${tagName}:latest`;

      case 'exec': return `root@a1b2c3d4e5f6:/#`;
      case 'logs': return `172.17.0.1 - - [12/Jun/2026:18:00:01 +0000] "GET / HTTP/1.1" 200 615\r\n172.17.0.1 - - [12/Jun/2026:18:00:02 +0000] "GET /favicon.ico HTTP/1.1" 404 555`;
      case 'stop': case 'start': case 'restart': case 'rm': case 'kill': return args[2] || 'a1b2c3d4e5f6';
      
      case 'network':
        if (args[2] === 'create') return generateId();
        if (args[2] === 'ls') return `NETWORK ID     NAME          DRIVER    SCOPE\r\n9f1503cb306a   bridge        bridge    local\r\nc71775f0a0c6   host          host      local\r\n23075c3f8f11   my-network    bridge    local\r\na1b2c3d4e5f6   none          null      local`;
        return `OK`;

      case 'volume':
        if (args[2] === 'create') return args[3] || `vol_${generateId(8)}`;
        if (args[2] === 'ls') return `DRIVER    VOLUME NAME\r\nlocal     my-data\r\nlocal     postgres-data`;
        return `OK`;

      case 'stats': return args.includes('--no-stream') ? `CONTAINER ID   NAME         CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O\r\na1b2c3d4e5f6   web-server   0.05%     12.5MiB / 7.77GiB    0.16%     1.2kB / 648B      0B / 0B` : '';
      case 'version': return `Client: Docker Engine - Community\r\n Version: 24.0.7\r\nServer: Docker Engine - Community\r\n Version: 24.0.7`;
      case 'inspect': return `[\r\n  {\r\n    "Id": "a1b2c3d4e5f6...",\r\n    "State": { "Status": "running", "Pid": 12345 },\r\n    "Image": "nginx:latest",\r\n    "NetworkSettings": { "IPAddress": "172.17.0.2" }\r\n  }\r\n]`;
      case 'tag': return ``;
      case 'rmi': return `Untagged: ${args[2] || 'image'}:latest\r\nDeleted: sha256:a1b2c3d4e5f6`;
      
      default: return `docker: '${sub}' is not a docker command.\r\nSee 'docker --help'`;
    }
  }

  private handleDockerCompose(args: string[]): string {
    const composeCmd = args[1];
    switch(composeCmd) {
      case 'up': return `Creating network "app_default" with the default driver\r\nCreating app_db_1    ... \\x1b[32mdone\\x1b[0m\r\nCreating app_web_1   ... \\x1b[32mdone\\x1b[0m\r\nAttaching to app_db_1, app_web_1\r\n\\x1b[36mdb_1   |\\x1b[0m PostgreSQL init process complete; ready for start up.\r\n\\x1b[33mweb_1  |\\x1b[0m Server listening on port 3000\r\n\r\n\\x1b[1;32m[SUCCESS] All services are running.\\x1b[0m`;
      case 'down': return `Stopping app_web_1  ... \\x1b[32mdone\\x1b[0m\r\nStopping app_db_1   ... \\x1b[32mdone\\x1b[0m\r\nRemoving app_web_1  ... \\x1b[32mdone\\x1b[0m\r\nRemoving app_db_1   ... \\x1b[32mdone\\x1b[0m\r\nRemoving network app_default`;
      case 'ps': return `     Name               Command          State           Ports\r\n─────────────────────────────────────────────────────────────\r\napp_db_1    docker-entrypoint.sh postgres   Up   5432/tcp\r\napp_web_1   docker-entrypoint.sh node       Up   0.0.0.0:3000->3000/tcp`;
      default: return `Usage: docker-compose [OPTIONS] COMMAND`;
    }
  }

  private handleKubectl(args: string[]): string {
    const sub = args[1];
    switch(sub) {
      case 'cluster-info': return `\\x1b[32mKubernetes control plane\\x1b[0m is running at \\x1b[33mhttps://127.0.0.1:6443\\x1b[0m`;
      case 'get':
        const resource = args[2];
        const ns = args.includes('-n') ? args[args.indexOf('-n') + 1] : 'default';
        if (resource === 'nodes') return `NAME           STATUS   ROLES           AGE   VERSION\r\ndlp-node-01    Ready    control-plane   30d   v1.28.2\r\ndlp-node-02    Ready    <none>          30d   v1.28.2`;
        if (resource === 'pods') return `NAME                          READY   STATUS    RESTARTS   AGE    NAMESPACE\r\nnginx-deploy-7fb96c846b-abc   1/1     Running   0          5m     ${ns}\r\nnginx-deploy-7fb96c846b-def   1/1     Running   0          5m     ${ns}`;
        if (resource === 'services' || resource === 'svc') return `NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE\r\nkubernetes     ClusterIP   10.96.0.1       <none>        443/TCP        30d\r\nnginx-svc      NodePort    10.96.128.45    <none>        80:30080/TCP   2m`;
        if (resource === 'deployments' || resource === 'deploy') return `NAME           READY   UP-TO-DATE   AVAILABLE   AGE\r\nnginx-deploy   2/2     2            2           5m`;
        if (resource === 'namespaces' || resource === 'ns') return `NAME              STATUS   AGE\r\ndefault           Active   30d\r\nkube-system       Active   30d`;
        if (resource === 'configmaps' || resource === 'cm') return `NAME               DATA   AGE\r\nkube-root-ca.crt   1      30d\r\napp-config         3      2m`;
        return `No resources found in ${ns} namespace.`;
    }

    return `bash: ${main}: command not found`;
  }
}
