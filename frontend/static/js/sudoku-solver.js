async function solveSudoku() {
    const formData = new FormData(document.getElementById('sudoku-form'));
    // formDataを使用して数独の問題をサーバーに送るデータを構築
    // 例えば、formDataからJSON形式のデータを作成

    // APIエンドポイントに対するリクエストのURL
    const apiUrl = 'https://your-backend-server.com/solve';

    try {
        // APIリクエストを送信
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({
                puzzle: formData.get('puzzle')  // 例: 数独のパズルデータ
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // レスポンスのJSONを解析
        const result = await response.json();

        // 結果をページに表示する
        displaySolution(result.solution);

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// 結果を表示するための関数
function displaySolution(solution) {
    // ここに解を表示するロジックを実装
    console.log(solution);
}

// フォーム送信イベントを処理
document.getElementById('sudoku-form').addEventListener('submit', function(e) {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ
    solveSudoku();
});
