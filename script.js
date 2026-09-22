const screens = [...document.querySelectorAll(".screen")];
const navButtons = [...document.querySelectorAll(".bottom-nav button")];
const toast = document.getElementById("toast");

function go(id){
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  navButtons.forEach(b => b.classList.toggle("active", b.dataset.go === id));
  window.scrollTo({top:0, behavior:"smooth"});
}

document.addEventListener("click", (e)=>{
  const target = e.target.closest("[data-go]");
  if(target) go(target.dataset.go);
});

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>toast.classList.remove("show"), 2200);
}

document.getElementById("notificationBtn").addEventListener("click", ()=>{
  showToast("새로운 귀로 화물 3건이 도착했어요 🚚");
});

const dateInput = document.getElementById("date");
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate()+1);
dateInput.value = tomorrow.toISOString().slice(0,10);

document.getElementById("cargoForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  const size = document.querySelector('input[name="size"]:checked').value;
  const date = dateInput.value;

  const cargo = {from,to,size,date,createdAt:new Date().toISOString()};
  localStorage.setItem("pisong-last-cargo", JSON.stringify(cargo));
  showToast(`${from} → ${to} ${size} 화물이 등록되었습니다!`);
  setTimeout(()=>go("recommend"), 600);
});

const cargoData = [
  {from:"서울", to:"대전", size:"소형", amount:"80,000원", date:"9.24(수)", new:true},
  {from:"부산", to:"서울", size:"중형", amount:"180,000원", date:"9.25(목)", new:false},
  {from:"광주", to:"인천", size:"소형", amount:"95,000원", date:"9.26(금)", new:false},
  {from:"대구", to:"부산", size:"중형", amount:"150,000원", date:"9.25(목)", new:false},
  {from:"대전", to:"서울", size:"대형", amount:"250,000원", date:"9.27(토)", new:true}
];

const list = document.getElementById("cargoList");
function renderCargo(filter="전체"){
  list.innerHTML = "";
  cargoData.filter(c=>filter==="전체" || c.size===filter).forEach((c)=>{
    const card = document.createElement("article");
    card.className = "cargo-card";
    card.innerHTML = `
      <div class="cargo-top">
        <b>📦 ${c.from} → ${c.to}</b>
        ${c.new?'<span class="new">NEW</span>':""}
      </div>
      <div class="cargo-meta">
        <span>화물 크기 <b>${c.size}</b></span>
        <span>예상 운임 <b>${c.amount}</b></span>
        <span>출발일 ${c.date}</span>
        <span>귀로 매칭 추천</span>
      </div>
      <button class="match-btn">이 화물 매칭하기</button>
    `;
    card.querySelector(".match-btn").addEventListener("click", ()=>{
      showToast(`${c.from} → ${c.to} 화물과 매칭되었습니다!`);
      setTimeout(()=>go("track"),600);
    });
    list.appendChild(card);
  });
}
renderCargo();

document.querySelectorAll(".chip").forEach(chip=>{
  chip.addEventListener("click", ()=>{
    document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    chip.classList.add("active");
    renderCargo(chip.textContent.trim());
  });
});

// 마이페이지 메뉴 데모
document.querySelectorAll(".menu-list button").forEach(btn=>{
  btn.addEventListener("click", ()=>showToast(`${btn.innerText.replace("›","").trim()} 기능은 데모 화면입니다.`));
});
