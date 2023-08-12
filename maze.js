let h, w, sy, sx, gy, gx, obstacle;
var dist;
let queue = [];
const btn = document.getElementById("btn");
btn.addEventListener("click", main); // START を押したら init を呼び出す
const board = document.getElementById("board"); // 盤面の状態
const result = document.getElementById("result");
const INF = 10**18;
let count = 0; // startを押した回数

function main() {

    // 初期化
    init();

    // 入力のエラー検出
    if (inputError()) {
        while (true) {
            // 既に盤面が出来上がっていたら削除する
            deleteGrid();

            // 盤面の生成
            createGrid();

            // スタート地点とゴール地点の探索
            searchStartAndEnd();
    
            // 障害物の配置
            putObstacle();
    
            // 幅優先探索を行う
            BreadthFirstSearch();
    
            // 到達できなかったマスを×で表示する
            impossible();
    
            if (dist[gy - 1][gx - 1] != INF) {
                break;
            }
        }
    }
}

// 初期化
function init() {
    h = Number(document.getElementById("height").value);
    w = Number(document.getElementById("width").value);
    sy = Number(document.getElementById("sy").value);
    sx = Number(document.getElementById("sx").value);
    gy = Number(document.getElementById("gy").value);
    gx = Number(document.getElementById("gx").value);
    obstacle = Number(document.getElementById("obstacle").value);
    console.log("h:", h, "w:", w, "sy:", sy, "sx:", sx, "gy:", gy, "gx:", gx, "obstacle:", obstacle);
}

// 入力値のエラー検出
function inputError() {
        // obstacle + 2 <= h * w を満たす必要がある
        if (obstacle + 2 > h * w) {
            result.textContent = "エラー：壁の数が多すぎます。"
            return false;
        }
        // W の制約
        if (w < 2 || w > 100) {
            result.textContent = "エラー： W の数が範囲外です。"
            return false;
        }
        // H の制約
        if (h < 2 || h > 100) {
            result.textContent = "エラー： H の数が範囲外です。"
            return false;
        }
        // スタート地点の配列外参照
        if (sy < 1 || sy > h || sx < 1 || sx > w) {
            result.textContent = "エラー：スタート地点が範囲外です。"
            return false;
        }
        // ゴール地点の配列外参照
        if (gy < 1 || gy > h || gx < 1 || gx > w) {
            result.textContent = "エラー：ゴール地点が範囲外です。"
            return false;
        }
        // スタート地点とゴール地点の被り
        if (sy === gy && sx === gx) {
            console.log(sy, sx, gy, gx, "koko");
            result.textContent = "エラー：スタート地点とゴール地点が同じ場所になっています。"
            return false;
        }
    return true;
}

// 既に盤面が出来上がっていたら削除する
function deleteGrid() {
    const table = document.getElementById("board");
    //table.removeChild();
    console.log(table);
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
}

// 盤面の生成
function createGrid() {
    for (let i = 0; i < h; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < w; j++) {
            const td = document.createElement("td");
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
}

// スタート地点とゴール地点を探索する
function searchStartAndEnd() {
    dist = new Array(h).fill(INF).map(() => new Array(w).fill(INF)); // 盤面の距離を生成する
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (i == sy - 1 && j == sx - 1) {
                board.rows[i].cells[j].textContent = "S";
                dist[i][j] = 0;
                board.rows[i].cells[j].style.backgroundColor = "#92D050";
                queue.push([i, j]);
            }
            if (i == gy - 1 && j == gx - 1) {
                board.rows[i].cells[j].textContent = "G";
                board.rows[i].cells[j].style.backgroundColor = "#92D050";
            }
        }
    }
}

// 壁の設置
function putObstacle() {
    for (let i = 0; i < obstacle; i++) {
        while (true) {
            const y = Math.floor(Math.random() * h);
            const x = Math.floor(Math.random() * w);
            if (dist[y][x] === INF && board.rows[y].cells[x].textContent != "G") {
                dist[y][x] = -1;
                board.rows[y].cells[x].classList.add("obstacle");
                board.rows[y].cells[x].style.backgroundColor = "black";
                break;
            }
        }
    }
}

// 幅優先探索を行う
function BreadthFirstSearch() {
    const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    while (queue.length) {
        const [prev_y, prev_x] = queue.shift();
        for (const [dy, dx] of direction) {
            const next_y = prev_y + dy;
            const next_x = prev_x + dx;
            if (0 <= next_y && next_y < h && 0 <= next_x && next_x < w) {
                if (dist[next_y][next_x] === INF) {
                    dist[next_y][next_x] = dist[prev_y][prev_x] + 1;
                    if (board.rows[prev_y][prev_x] === "S") {
                        board.rows[next_y].cells[next_x].textContent = "1";
                        board.rows[next_y].cells[next_x].style.backgroundColor = "#FEC100";
                    } else if (board.rows[next_y].cells[next_x].textContent != "G") {
                        board.rows[next_y].cells[next_x].textContent = dist[next_y][next_x];
                        board.rows[next_y].cells[next_x].style.backgroundColor = "#FEC100";
                    }
                    queue.push([next_y, next_x]);
                }
            }
        }
    }
}

function impossible() {
    for (let i = 0;i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (dist[i][j] === INF) {
                board.rows[i].cells[j].textContent = "×";
            }
        }
    }
}