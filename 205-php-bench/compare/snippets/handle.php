function handle(PDO $db): void {
    switch (strtok($_SERVER["REQUEST_URI"], "?")) {
        case "/text":
            header("Content-Type: text/plain; charset=utf-8");
            echo "Hello, World!";
            break;
        case "/json":
            header("Content-Type: application/json");
            echo json_encode(["message" => "Hello, World!"]);
            break;
        case "/fortunes":
            header("Content-Type: text/html; charset=utf-8");
            echo fortunes_page(FORTUNES);
            break;
        case "/db":
            header("Content-Type: text/html; charset=utf-8");
            echo fortunes_page($db->query("select id, message from fortune")->fetchAll(PDO::FETCH_NUM));
            break;
