// Dev-only helper. `tinacms dev` listens on ::1 only; when the site is previewed
// from another machine/container this forwards 0.0.0.0:<port> -> [::1]:<port>.
import net from 'node:net';
const port = Number(process.argv[2] || 8173);
net.createServer((c) => {
  const up = net.connect({ host: '::1', port });
  c.pipe(up).pipe(c);
  const drop = () => { c.destroy(); up.destroy(); };
  c.on('error', drop); up.on('error', drop);
}).listen(port, '0.0.0.0', () => console.log(`tina proxy 0.0.0.0:${port} -> [::1]:${port}`));
