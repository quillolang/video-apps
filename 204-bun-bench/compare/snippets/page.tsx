function Page({ list }: { list: Fortune[] }) {
  const all = [...list, { id: 0, message: "Additional fortune added at request time." }];
  all.sort((a, b) => (a.message < b.message ? -1 : a.message > b.message ? 1 : 0));
  return (
    <>{raw("<!doctype html>")}<html>
      <head><title>Fortunes</title></head>
      <body><table>
        <tr><th>id</th><th>message</th></tr>
        {all.map((f) => <tr><td>{f.id}</td><td>{f.message}</td></tr>)}
      </table></body>
    </html></>
  );
}
