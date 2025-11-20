async function getData() {
  let r = await fetch("api.php?action=get");
  return await r.json();
}

async function login(code) {
  let r = await fetch("api.php?action=login", {
      method: "POST",
      body: new FormData().append("code", code)
  });
  return await r.json();
}

async function updateScore(cls, code, subject, score){
  let fd = new FormData();
  fd.append("cls", cls);
  fd.append("code", code);
  fd.append("subject", subject);
  fd.append("score", score);

  await fetch("api.php?action=updateScore", { method:"POST", body:fd });
}
