"use strict";var e=require("path"),o=require("os"),s=require("fs"),a=require("fs/promises"),r=require("child_process");function n(e){return s.existsSync(e)}function c(e,o,s=[]){return new Promise(((a,n)=>{console.log(`${o} ${s.join(" ")} 中...... in`,e);const c=r.spawn(o,s,{cwd:e});c.stdout.on("data",(e=>{console.log(`yarn stdout: ${e}`)})),c.stderr.on("data",(e=>{console.error(`yarn stderr: ${e}`)})),c.on("close",(e=>{0!==e?n(new Error(`yarn process exited with code ${e}`)):a(!0)}))}))}class t extends Error{}async function i(o,s){await async function(o,s){const r=`\n  APP_NAME=${o.name||"H5Pack"}\n  `;try{await a.writeFile(e.resolve(s,".env"),r,"utf-8")}catch(e){console.error("write env file error",e)}}(o,s),await async function(o,s){if(!o.splash)return;const r=e.basename(o.splash),i=e.resolve(process.cwd(),o.splash),l=e.resolve(s,`./public/splash/${r}`);if(!n(i))throw new t("splash path error");await a.copyFile(i,l),console.log("splash copy Success"),await c(s,"yarn",["react-native","generate-bootsplash",e.resolve(s,`./public/splash/${r}`),"--platforms=android"]),console.log("splash generate Success")}(o,s)}async function l(o,r){console.log("rootDir",r);const t=e.join(r,"./h5pack-native"),l=e.resolve(process.cwd(),o.entry);n(l)||console.error("路径不正确，请检查配置");const p=e.join(r,"./h5pack-native/public/webview/dist");await async function(o,s){try{(await a.readdir(o)).forEach((async r=>{const n=e.join(o,r),c=e.join(s,r);await a.copyFile(n,c)}))}catch(e){console.error(e)}}(l,p),await i(o,t),await c(t,"yarn",["release"]),await async function(o){await s.promises.copyFile(e.join(o,"./h5pack-native/android/app/build/outputs/apk/release/app-release.apk"),"app-release.apk")}(r),console.log("打包完成")}let p;console.log("hello world");module.exports=()=>{p=require(e.resolve(process.cwd(),"h5pack.json")),async function(){console.log("pack",p);const s=o.tmpdir(),a=e.join(s,"app-build");await l(p,a)}()};
