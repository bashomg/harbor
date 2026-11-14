const fs=require('fs')
const path=require('path')
const pair=(process.env.HARBOR_REPO||'').trim().split('/')
const owner=pair[1]?pair[0]:process.env.VERCEL_GIT_REPO_OWNER||''
const slug=pair[1]?pair[1]:process.env.VERCEL_GIT_REPO_SLUG||''
const src=fs.readFileSync(path.join(__dirname,'index.html'),'utf8')
if(!src.includes("const REPO=''"))throw new Error("index.html is missing the line const REPO=''")
let out=src
if(owner&&slug){
  const repo=owner.replace(/[^\w.-]/g,'')+'/'+slug.replace(/[^\w.-]/g,'')
  out=src.replace("const REPO=''",`const REPO='${repo}'`)
  console.log(`Harbor site: download buttons use the releases of github.com/${repo}`)
}else if(process.env.VERCEL){
  throw new Error('Harbor site: no GitHub repo found. Either add an environment variable HARBOR_REPO set to yourname/yourrepo, or turn on "Automatically expose System Environment Variables" in the Vercel project settings. Then redeploy.')
}else{
  console.log('Harbor site: no repo set, so the download buttons use files next to index.html')
}
fs.mkdirSync(path.join(__dirname,'public'),{recursive:true})
fs.writeFileSync(path.join(__dirname,'public','index.html'),out)
