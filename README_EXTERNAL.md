#Figmiro server

![Figmiro logo](/images/cover.svg)

This is proxy server that works with [Miro's](https://miro.com) REST API.

Such a proxy is needed first of all in order to solve Figmiro plugin problems with cors policies.


## Contribution

Any ideas, issues and pull requests are welcome.

Be sure that you have at least 8 version of node.js, and of course npm. 

For local work on the plugin you need to run commands bellow:

```shell script
npm run dev
# then, in another terminal tab
npm run ngrok
```

During execution of second command you will see public https address 
that can be accessed for 8 hours ([ngrok's docs](https://ngrok.com/docs)).

![Ngrok https address](/images/ngrok-screen.png)

You need to copy this public https address string and paste it in */app/helpers/request.ts* file
instead of previous *baseURL* string at [plugin](https://github/smth)

![Request file](/images/plugin-file.png)

Then start [plugin](https://github/smth/readme.md) development mode and you ready to go!

Made by [Redmadrobot](https://www.redmadrobot.com/) 🤖
