"use strict";

{
    function copyMatrix(base) {
        const result = [];
        for (const line of base) {
            result.push([...line]);
        }
        return result;
    }

    function getnum(x,y){
        return x*n+y
    }

    function isvalid(x,y){
        if(0<=x && x<n && 0<=y && y<n){
            return true
        }else{
            return false
        }
    }

    function bfs(i,G){
        let que = []
        let dist = [...Array(n*n)].map(()=>-1)
        dist[i] = 0
        que.push(i)
        while(que.length!=0){
            let v = que.shift()
            G[v].forEach((next_v, index) => {
                if(dist[next_v]!==-1) return
                dist[next_v] = dist[v] + 1
                que.push(next_v)
                pre[next_v]=v
            })
        }
        return pre
    }

    function OutputRoute(S){
        let T = copyMatrix(S)
        let si
        let sj
        let gi
        let gj
        for(let i=0;i<n;i++) {
            for(let j=0;j<n;j++){
                if(S[i][j]=="S"){
                    si = i
                    sj = j
                }
                if(S[i][j]=="G"){
                    gi = i
                    gj = j
                }
            }
        }
        let G = [...Array(n*n)].map(()=>[])
        for(let i=0;i<n;i++){
            for(let j=0;j<n;j++){
                for(let l=0;l<4;l++){
                    for(let k=1;k<n;k++){
                        if(S[i][j]==="#" || isvalid(i+k*dx[l], j+k*dy[l])==false) continue
                        if(S[i+k*dx[l]][j+k*dy[l]]==="#" && isvalid(i+(k-1)*dx[l], j+(k-1)*dy[l])){
                            if(k==1) break
                            G[getnum(i,j)].push(getnum(i+(k-1)*dx[l], j+(k-1)*dy[l]))
                            break
                        }
                        if(isvalid(i+(k+1)*dx[l], j+(k+1)*dy[l])===false){
                            G[getnum(i,j)].push(getnum(i+k*dx[l], j+k*dy[l]))
                            break
                        }
                        if(S[i+k*dx[l]][j+k*dy[l]]=="." || S[i+k*dx[l]][j+k*dy[l]]=="S" || S[i+k*dx[l]][j+k*dy[l]]=="G"){
                            G[getnum(i,j)].push(getnum(i+k*dx[l], j+k*dy[l]))
                            break
                        }
                    }
                }
            }
        }
        pre = [...Array(n*n)].map(()=>-1)
        pre = bfs(getnum(si,sj),G)
        let e = getnum(gi,gj)
        let path = [[Math.floor(e/n), e%n]]
        while (e!==getnum(si,sj)){
            e = pre[e]
            path.push([Math.floor(e/n), e%n])
            if(e==-1){
                return -1
            }
        }
        path.reverse()
        let c
        let num
        let bl
        for(let i=1;i<path.length;i++){
            if(path[i-1][0]===path[i][0]){
                c = "→"
                num =  Math.abs(path[i][1]-path[i-1][1])
                bl = path[i][1]-path[i-1][1]<0
                for(let j=0;j<num;j++){
                    let jj = j
                    if(bl){
                        c = "←"
                        jj = j*-1
                    }
                    T[path[i-1][0]][path[i-1][1]+jj] = c
                }
            }
            else{
                c = "↓"
                num =  Math.abs(path[i][0]-path[i-1][0])
                bl = path[i][0]-path[i-1][0]<0
                for(let j=0;j<num;j++){
                    let jj = j
                    if(bl){
                        c = "↑"
                        jj = j*-1
                    }
                    T[path[i-1][0]+jj][path[i-1][1]] = c
                }
            }
        }
        T[si][sj] = "S"
        T[gi][gj] = "G"
        return T
    }

    function process(n,S){
        S[0][0]="S"
        S[n-1][n-1]="G"
        let T = copyMatrix(S)
        const grid = document.querySelector(".grid")
        btnStart.addEventListener("click",()=>{
            btnStart.classList.add("active")
            btnGoal.classList.remove("active")
            btnRoute.classList.remove("active")
            btnWall.classList.remove("active")
            btnIce.classList.remove("active")
        })
        btnGoal.addEventListener("click",()=>{
            btnStart.classList.remove("active")
            btnGoal.classList.add("active")
            btnRoute.classList.remove("active")
            btnWall.classList.remove("active")
            btnIce.classList.remove("active")
        })
        btnRoute.addEventListener("click",()=>{
            btnStart.classList.remove("active")
            btnGoal.classList.remove("active")
            btnRoute.classList.add("active")
            btnWall.classList.remove("active")
            btnIce.classList.remove("active")
        })
        btnWall.addEventListener("click",()=>{
            btnStart.classList.remove("active")
            btnGoal.classList.remove("active")
            btnRoute.classList.remove("active")
            btnWall.classList.add("active")
            btnIce.classList.remove("active")
        })
        btnIce.addEventListener("click",()=>{
            btnStart.classList.remove("active")
            btnGoal.classList.remove("active")
            btnRoute.classList.remove("active")
            btnWall.classList.remove("active")
            btnIce.classList.add("active")
        })
        
        let className
        let chr = "."
        for(let i=0;i<n*n;i++){
            const item =document.createElement("div")
            item.classList.add("item")
            item.style.height=`${screenWidth/n}px`
            item.style.width=`${screenWidth/n}px`
            grid.appendChild(item)
            item.addEventListener("click",()=>{
                if(btnRoute.classList.contains("active")){
                    className = "route"
                    chr = "."
                }else if(btnWall.classList.contains("active")){
                    className = "wall"
                    chr = "#"
                }else if(btnIce.classList.contains("active")){
                    className = "ice"
                    chr = "o"
                }else if(btnStart.classList.contains("active")){
                    className = "start"
                    chr = "S"
                    for(let j=0;j<n*n;j++){
                        if(S[Math.floor(j/n)][j%n]=="S"){
                            J = j
                            S[Math.floor(j/n)][j%n] = "."
                        }
                    }
                    items[J].classList.remove("start")
                }else if(btnGoal.classList.contains("active")){
                    className = "goal"
                    chr = "G"
                    for(let k=0;k<n*n;k++){
                        if(S[Math.floor(k/n)][k%n]=="G"){
                            K = k
                            S[Math.floor(k/n)][k%n] = "."
                        }
                    }
                    items[K].classList.remove("goal")
                }
                S[Math.floor(i/n)][i%n]=chr
                item.classList.remove("route")
                item.classList.remove("wall")
                item.classList.remove("ice")
                item.classList.remove("start")
                item.classList.remove("goal")
                item.classList.add(className)
                T = OutputRoute(S)
            })
        }
        let J
        let K
        const items = document.querySelectorAll(".item")
        pathOnoff.addEventListener("click",()=>{
            for(let i=0;i<n*n;i++){
                items[i].classList.toggle("hidden")
            }
        })
        grids.addEventListener("click",()=>{
            for(let i=0;i<n*n;i++){
                items[i].classList.remove("up")
                items[i].classList.remove("right")
                items[i].classList.remove("down")
                items[i].classList.remove("left")
            }
            if(OutputRoute(S)==-1){
                return
            }
            for(let i=0;i<n*n;i++){
                items[i].classList.remove("path")
                if(T[Math.floor(i/n)][i%n]=="↑"){
                    items[i].classList.add("up")
                }else if(T[Math.floor(i/n)][i%n]=="→"){
                    items[i].classList.add("right")
                }else if(T[Math.floor(i/n)][i%n]=="↓"){
                    items[i].classList.add("down")
                }else if(T[Math.floor(i/n)][i%n]=="←"){
                    items[i].classList.add("left")
                }
            }
        })
        items[0].classList.add("start")
        items[(n*n)-1].classList.add("goal")
        btnReset.addEventListener("click",()=>{

            for(let i=0;i<n*n;i++){
                S[Math.floor(i/n)][i%n]="."
                items[i].classList.remove("up")
                items[i].classList.remove("right")
                items[i].classList.remove("down")
                items[i].classList.remove("left")
                items[i].classList.remove("route")
                items[i].classList.remove("wall")
                items[i].classList.remove("ice")
                items[i].classList.remove("start")
                items[i].classList.remove("goal")
            }
            items[0].classList.add("start")
            items[(n*n)-1].classList.add("goal")
            S[0][0]="S"
            S[n-1][n-1]="G"
        })
    }
    const dy = [0,1,0,-1]
    const dx = [-1,0,1,0]
    let n = 4
    const grids = document.querySelector(".grid")
    const btnRoute = document.querySelector(".btn-route")
    const btnWall = document.querySelector(".btn-wall")
    const btnIce = document.querySelector(".btn-ice")
    const btnReset = document.querySelector(".btn-reset")
    const btnStart = document.querySelector(".btn-set-start")
    const btnGoal = document.querySelector(".btn-set-goal")
    const pathOnoff = document.getElementById("path-onoff")
    let screenWidth = 500
    let pre = [...Array(n*n)].map(()=>-1)
    let S = new Array(n);
    for(let i=0;i<n;i++){
        S[i] = new Array(n);
        for(let j=0;j<n;j++){
            S[i][j] = "."
        }
    }
    if(window.innerWidth<=550){
        screenWidth = 320
    }
    window.addEventListener("resize",()=>{
        if(window.innerWidth<=550){
            window.location.reload()
            screenWidth = 320
        }
    })
    process(n,S)
    const numb = document.getElementById("number")
    const check = document.getElementById("check")
    check.addEventListener("click",()=>{
        n = numb.value
        let S = new Array(n);
        for(let i=0;i<n;i++){
            S[i] = new Array(n);
            for(let j=0;j<n;j++){
                S[i][j] = "."
            }
        }
        while(grids.lastChild){
            grids.removeChild(grids.lastChild)
        }
        process(n,S)
    })
}