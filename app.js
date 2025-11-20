let classes = {}, subjects = [];
let adminUser="admin", adminPass="admin123", teacherUser="teach", teacherPass="teach123";
let userRole="", currentStudent=null;

async function fetchData() {
  const res = await fetch('/classes');
  const data = await res.json();
  classes = data.classes;
  subjects = data.subjects;
}

async function loginUser() {
  const code = loginCode.value.trim();
  const pass = loginPass.value.trim();

  await fetchData();

  if(code===adminUser && pass===adminPass) userRole="admin";
  else if(code===teacherUser && pass===teacherPass) userRole="teacher";
  else {
    for(let cls in classes){
      let student = classes[cls].find(s=>s.code===code);
      if(student){ userRole="student"; currentStudent={cls, student}; break; }
    }
  }
  if(!userRole) return alert("نام کاربری یا کد ملی اشتباه است");

  loginPage.classList.remove("active");
  dashboardPage.classList.add("active");
  if(userRole=="admin"){ userRoleTitle.innerText="پنل مدیریت"; renderClass(); adminPanel();}
  else if(userRole=="teacher"){ userRoleTitle.innerText="پنل معلم"; renderClass();}
  else showStudentDashboard();
}

function renderClass(){
  if(userRole=="student") return showStudentDashboard();
  const c = classSelect.value;
  let html = `<table><tr><th>کد ملی</th><th>دانش‌آموز</th>`;
  subjects.forEach(sub=> html+=`<th>${sub}</th>`);
  html+=`<th>میانگین</th><th>عملیات</th></tr>`;

  classes[c].forEach(s=>{
    const avg = calcAvg(s.scores);
    html+=`<tr>
    <td>${s.code}</td>
    <td><input value="${s.name}" onchange="editStudent('${c}','${s.code}','name',this.value)"></td>`;
    subjects.forEach(sub=>{
      html+=`<td><input value="${s.scores[sub]}" onchange="updateScore('${c}','${s.code}','${sub}',this.value)"></td>`;
    });
    html+=`<td>${avg}</td>
    <td><button onclick="showChart('${c}','${s.code}')">📈</button><button onclick="deleteStudent('${c}','${s.code}')">❌</button></td>
    </tr>`;
  });

  studentsArea.innerHTML = html;
}

function showStudentDashboard(){
  const s = currentStudent.student;
  let html=`<h3>${s.name} (${s.code})</h3><table><tr><th>درس</th><th>نمره</th></tr>`;
  for(let l in s.scores){ html+=`<tr><td>${l}</td><td>${s.scores[l]||'-'}</td></tr>`; }
  html+=`</table><button onclick="showChart('${currentStudent.cls}','${s.code}')">📈 نمودار پیشرفت</button>`;
  studentsArea.innerHTML=html;
}

function calcAvg(sc){
  let arr = Object.values(sc).map(Number).filter(n=>!isNaN(n));
  return arr.length? (arr.reduce((a,b)=>a+b)/arr.length).toFixed(2) : "-";
}

async function updateScore(cls, code, sub, val){
  await fetch('/update-score',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({cls, code, subject:sub, score:val})
  });
  await fetchData();
  renderClass();
}

async function editStudent(cls, code, field, val){
  const student = classes[cls].find(s=>s.code===code);
  if(field==='name') student.name=val;
  await updateScore(cls, code, subjects[0], student.scores[subjects[0]]); // ساده برای ذخیره
}

async function deleteStudent(cls, code){
  if(!confirm("آیا مطمئن هستید؟")) return;
  classes[cls]=classes[cls].filter(s=>s.code!==code);
  const data = {classes, subjects};
  await fetch('/update-score',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
  await fetchData();
  renderClass();
}

function printClass(){ window.print(); }
function logout(){ location.reload(); }

function adminPanel(){
  studentsArea.innerHTML=`<h3>مدیریت کلاس‌ها و دانش‌آموزان</h3>
  <button onclick="addStudent()">➕ افزودن دانش‌آموز</button>
  <button onclick="addSubject()">➕ افزودن درس</button>
  <hr>` + studentsArea.innerHTML;
}

async function addStudent(){
  const cls = prompt("نام کلاس:");
  const name = prompt("نام دانش‌آموز:");
  const code = prompt("کد ملی:");
  await fetch('/add-student',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({cls,name,code})
  });
  await fetchData();
  renderClass();
}

async function addSubject(){
  const sub = prompt("نام درس جدید:");
  await fetch('/add-subject',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({subject:sub})});
  await fetchData();
  renderClass();
}

function showChart(cls, code){
  const s = classes[cls].find(s=>s.code===code);
  chartTitle.innerText = `نمودار پیشرفت ${s.name} (${s.code})`;
  chartArea.innerHTML='';
  for(let l in s.scores){
    let val = Number(s.scores[l])||0;
    chartArea.innerHTML+=`<div>${l}: ${val}</div><div class='chart-bar' style='width:${val*10}px'></div>`;
  }
  chartModal.style.display='flex';
}
function closeChart(){ chartModal.style.display='none'; }

window.onload = fetchData;
