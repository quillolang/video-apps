function fortunes_page(array $all): string {
    $all[] = [0, "Additional fortune added at request time."];
    usort($all, fn($a, $b) => strcmp($a[1], $b[1]));
    $rows = "";
    foreach ($all as [$id, $message]) {
        $rows .= "<tr><td>$id</td><td>" . htmlspecialchars($message, ENT_QUOTES | ENT_HTML5) . "</td></tr>";
    }
    return "<!doctype html><html><head><title>Fortunes</title></head><body><table>"
        . "<tr><th>id</th><th>message</th></tr>$rows</table></body></html>";
}
