// 游戏画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布可聚焦
canvas.tabIndex = 0;
canvas.style.outline = 'none';
// 自动聚焦画布
window.onload = function() {
    canvas.focus();
};

// 游戏状态
let score = 0;
let gameRunning = true;
let gamePaused = false;
let gameStarted = false;

// 蛇的初始状态（只有一个头）
const snake = [
    { x: 200, y: 200 } // 蛇头
];

// 蛇的移动方向
let direction = 'right';
let nextDirection = 'right';

// 蛇和汤圆的尺寸
const snakeSize = 20;
const foodSize = 20;

// 汤圆对象
let food = {
    x: Math.floor(Math.random() * (400 - foodSize) / 10) * 10,
    y: Math.floor(Math.random() * (400 - foodSize) / 10) * 10
};

// 游戏速度
const speed = 6;
let gameLoopInterval;

// 按键状态
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// 初始化游戏
function init() {
    // 开始游戏循环
    gameLoopInterval = setInterval(gameLoop, 1000 / speed);
}

// 游戏循环
function gameLoop() {
    if (!gameRunning) return;
    if (gamePaused) {
        // 绘制游戏元素（保持画面）
        drawSnake();
        drawFood();
        // 绘制暂停提示
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏已暂停', canvas.width/2, canvas.height/2 - 20);
        ctx.font = '16px Arial';
        ctx.fillText('点击继续游戏按钮恢复', canvas.width/2, canvas.height/2 + 20);
        return;
    }
    if (!gameStarted) {
        // 绘制游戏元素
        drawSnake();
        drawFood();
        // 绘制开始提示
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('请点击开始游戏按钮', canvas.width/2, canvas.height/2 - 20);
        return;
    }
    
    // 更新方向
    direction = nextDirection;
    
    // 移动蛇头
    moveSnake();
    
    // 检测碰撞
    checkCollisions();
    
    // 绘制游戏元素
    drawSnake();
    drawFood();
    
    // 更新UI
    updateUI();
}

// 移动蛇
function moveSnake() {
    // 获取蛇头位置
    const head = { ...snake[0] };
    
    // 根据方向移动蛇头
    switch (direction) {
        case 'up':
            head.y -= snakeSize;
            break;
        case 'down':
            head.y += snakeSize;
            break;
        case 'left':
            head.x -= snakeSize;
            break;
        case 'right':
            head.x += snakeSize;
            break;
    }
    
    // 将新头部添加到蛇身
    snake.unshift(head);
    
    // 检查是否吃到汤圆（使用更宽松的碰撞检测）
    if (Math.abs(head.x - food.x) < snakeSize && Math.abs(head.y - food.y) < snakeSize) {
        // 增加分数
        score++;
        // 生成新汤圆
        generateFood();
    } else {
        // 移除尾部
        snake.pop();
    }
}

// 生成新汤圆
function generateFood() {
    // 确保汤圆不会生成在蛇身上
    let validPosition = false;
    while (!validPosition) {
        // 生成与蛇移动路径匹配的位置
        food.x = Math.floor(Math.random() * (400 / snakeSize)) * snakeSize;
        food.y = Math.floor(Math.random() * (400 / snakeSize)) * snakeSize;
        
        validPosition = true;
        for (const segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                validPosition = false;
                break;
            }
        }
    }
}

// 检测碰撞
function checkCollisions() {
    const head = snake[0];
    
    // 检测边界碰撞
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameRunning = false;
        clearInterval(gameLoopInterval);
        if (confirm('游戏结束！最终得分：' + score + '\n是否重新开始？')) {
            location.reload();
        }
    }
    
    // 检测自身碰撞（可选）
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameRunning = false;
            clearInterval(gameLoopInterval);
            if (confirm('游戏结束！最终得分：' + score + '\n是否重新开始？')) {
                location.reload();
            }
        }
    }
}

// 绘制蛇
function drawSnake() {
    // 绘制静态背景（春节主题）
    ctx.fillStyle = '#fef2f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制静态装饰（红色圆点）
    ctx.fillStyle = 'rgba(220, 38, 38, 0.1)';
    const dotPositions = [
        {x: 50, y: 50}, {x: 150, y: 100}, {x: 250, y: 50}, {x: 350, y: 100},
        {x: 50, y: 200}, {x: 150, y: 150}, {x: 250, y: 200}, {x: 350, y: 150},
        {x: 50, y: 300}, {x: 150, y: 250}, {x: 250, y: 300}, {x: 350, y: 250},
        {x: 100, y: 50}, {x: 200, y: 100}, {x: 300, y: 50}, {x: 400, y: 100},
        {x: 100, y: 200}, {x: 200, y: 150}, {x: 300, y: 200}, {x: 400, y: 150}
    ];
    dotPositions.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 绘制蛇身（金色）
    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(snake[i].x + snakeSize/2, snake[i].y + snakeSize/2, snakeSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        // 蛇身纹理
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(snake[i].x + snakeSize/2, snake[i].y + snakeSize/2, snakeSize/4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 绘制Q版人物头部（蛇头）
    const headX = snake[0].x + snakeSize/2;
    const headY = snake[0].y + snakeSize/2;
    
    // 头部轮廓
    ctx.fillStyle = '#ffd7b5';
    ctx.beginPath();
    ctx.arc(headX, headY, snakeSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // 头发
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(headX, headY - 5, snakeSize/2, 0, Math.PI);
    ctx.fill();
    
    // 眼睛
    ctx.fillStyle = '#333';
    if (direction === 'right') {
        ctx.beginPath();
        ctx.arc(headX + 5, headY - 2, 3, 0, Math.PI * 2);
        ctx.arc(headX + 5, headY + 4, 3, 0, Math.PI * 2);
        ctx.fill();
    } else if (direction === 'left') {
        ctx.beginPath();
        ctx.arc(headX - 5, headY - 2, 3, 0, Math.PI * 2);
        ctx.arc(headX - 5, headY + 4, 3, 0, Math.PI * 2);
        ctx.fill();
    } else if (direction === 'up') {
        ctx.beginPath();
        ctx.arc(headX - 3, headY - 5, 3, 0, Math.PI * 2);
        ctx.arc(headX + 3, headY - 5, 3, 0, Math.PI * 2);
        ctx.fill();
    } else if (direction === 'down') {
        ctx.beginPath();
        ctx.arc(headX - 3, headY + 3, 3, 0, Math.PI * 2);
        ctx.arc(headX + 3, headY + 3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 嘴巴（微笑）
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    if (direction === 'right') {
        ctx.beginPath();
        ctx.arc(headX + 8, headY, 5, 0, Math.PI);
        ctx.stroke();
    } else if (direction === 'left') {
        ctx.beginPath();
        ctx.arc(headX - 8, headY, 5, 0, Math.PI);
        ctx.stroke();
    } else if (direction === 'up') {
        ctx.beginPath();
        ctx.arc(headX, headY - 8, 5, 0, Math.PI);
        ctx.stroke();
    } else if (direction === 'down') {
        ctx.beginPath();
        ctx.arc(headX, headY + 8, 5, 0, Math.PI);
        ctx.stroke();
    }
    
    // 腮红
    ctx.fillStyle = 'rgba(255, 182, 193, 0.5)';
    if (direction === 'right') {
        ctx.beginPath();
        ctx.arc(headX + 8, headY - 3, 2, 0, Math.PI * 2);
        ctx.arc(headX + 8, headY + 5, 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (direction === 'left') {
        ctx.beginPath();
        ctx.arc(headX - 8, headY - 3, 2, 0, Math.PI * 2);
        ctx.arc(headX - 8, headY + 5, 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (direction === 'up') {
        ctx.beginPath();
        ctx.arc(headX - 5, headY - 5, 2, 0, Math.PI * 2);
        ctx.arc(headX + 5, headY - 5, 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (direction === 'down') {
        ctx.beginPath();
        ctx.arc(headX - 5, headY + 5, 2, 0, Math.PI * 2);
        ctx.arc(headX + 5, headY + 5, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 绘制汤圆
function drawFood() {
    // 汤圆主体（传统汤圆色）
    ctx.fillStyle = '#fff9e6';
    ctx.beginPath();
    ctx.arc(food.x + foodSize/2, food.y + foodSize/2, foodSize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // 汤圆纹理
    ctx.fillStyle = 'rgba(255, 204, 153, 0.3)';
    ctx.beginPath();
    ctx.arc(food.x + foodSize/3, food.y + foodSize/3, foodSize/6, 0, Math.PI * 2);
    ctx.fill();
    
    // 汤圆细节（棕色点缀）
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(food.x + foodSize/2, food.y + foodSize/2, foodSize/8, 0, Math.PI * 2);
    ctx.fill();
    
    // 汤圆轮廓
    ctx.strokeStyle = 'rgba(255, 204, 153, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(food.x + foodSize/2, food.y + foodSize/2, foodSize/2, 0, Math.PI * 2);
    ctx.stroke();
}

// 更新UI
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('length').textContent = snake.length;
}

// 键盘事件监听
function handleKeyDown(e) {
    // 防止页面滚动
    e.preventDefault();
    
    // 只有在游戏开始后才能控制小蛇
    if (!gameStarted || gamePaused) return;
    
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                nextDirection = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                nextDirection = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                nextDirection = 'right';
            }
            break;
    }
}

// 为文档添加键盘事件监听器
document.addEventListener('keydown', handleKeyDown);

// 为画布添加键盘事件监听器
canvas.addEventListener('keydown', handleKeyDown);

// 添加开始游戏按钮事件监听器
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function() {
    gameStarted = true;
    startButton.disabled = true;
    startButton.style.backgroundColor = '#94a3b8';
});

// 添加暂停按钮事件监听器
const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', function() {
    if (!gameStarted) return;
    gamePaused = !gamePaused;
    if (gamePaused) {
        pauseButton.textContent = '继续游戏';
    } else {
        pauseButton.textContent = '暂停游戏';
    }
});

// 启动游戏
init();