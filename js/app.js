// 鼓励语库
const ENCOURAGEMENTS = [
  "妈妈最棒！坚持就是胜利！💪",
  "今天也是努力的一天，加油！🌸",
  "每天进步一点点，健康离你更近一步！",
  "妈妈身材会越来越好！继续加油！✨",
  "自律的妈妈最美！",
  "坚持下去，惊喜在等着你！🎉",
  "今天又战胜了自己，了不起！",
  "瘦下来后，世界更精彩！",
  "妈妈是最坚强的，加油！❤️",
  "今天的付出，明天看得见！",
  "健康比什么都重要，加油！",
  "你是最棒的妈妈！🌟",
  "一步一步来，梦想会实现！",
  "自律给你自由！",
  "坚持打卡的妈妈最美！💕"
];

const STORAGE_KEY = "mom_fitness_data";

function getData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { records: [], goalWeight: null };
  } catch {
    return { records: [], goalWeight: null };
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDate(str) {
  const d = new Date(str);
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${str} ${weekdays[d.getDay()]}`;
}

function getRandomEncouragement() {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

function init() {
  const data = getData();
  document.getElementById("todayDate").textContent = formatDate(getTodayStr());
  document.getElementById("checkinBtn").addEventListener("click", handleCheckin);
  document.getElementById("saveGoalBtn").addEventListener("click", handleSaveGoal);
  if (data.goalWeight) {
    document.getElementById("goalWeight").value = data.goalWeight;
  }
  const todayRecord = data.records.find(r => r.date === getTodayStr());
  if (todayRecord) {
    document.getElementById("weightInput").value = todayRecord.weight;
    showEncouragement(todayRecord);
  }
  updateStats(data);
  renderHistory(data);
}

function handleCheckin() {
  const weightInput = document.getElementById("weightInput");
  const weight = parseFloat(weightInput.value);
  if (isNaN(weight) || weight < 30 || weight > 200) {
    alert("请输入有效的体重（30-200 kg）");
    return;
  }
  const data = getData();
  const today = getTodayStr();
  const existingIndex = data.records.findIndex(r => r.date === today);
  const record = { date: today, weight: weight, timestamp: Date.now() };
  if (existingIndex >= 0) {
    data.records[existingIndex] = record;
  } else {
    data.records.push(record);
  }
  data.records.sort((a, b) => b.date.localeCompare(a.date));
  saveData(data);
  showEncouragement(record);
  updateStats(data);
  renderHistory(data);
}

function showEncouragement(record) {
  const box = document.getElementById("encouragementBox");
  const textEl = document.getElementById("encouragementText");
  const timeEl = document.getElementById("checkinTime");
  textEl.textContent = getRandomEncouragement();
  const time = new Date(record.timestamp);
  timeEl.textContent = "打卡时间：" + time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0");
  box.classList.add("visible");
}

function handleSaveGoal() {
  const input = document.getElementById("goalWeight");
  const goal = parseFloat(input.value);
  if (isNaN(goal) || goal < 30 || goal > 200) {
    alert("请输入有效的目标体重（30-200 kg）");
    return;
  }
  const data = getData();
  data.goalWeight = goal;
  saveData(data);
  updateStats(data);
  alert("目标已保存！");
}

function updateStats(data) {
  document.getElementById("totalDays").textContent = data.records.length;
  if (data.records.length > 0) {
    const latest = data.records[0];
    document.getElementById("currentWeight").textContent = latest.weight + " kg";
    if (data.goalWeight) {
      const startWeight = data.records[data.records.length - 1].weight;
      const total = startWeight - data.goalWeight;
      const current = startWeight - latest.weight;
      const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
      document.getElementById("goalProgress").textContent = percent + "%";
    } else {
      document.getElementById("goalProgress").textContent = "--";
    }
  } else {
    document.getElementById("currentWeight").textContent = "--";
    document.getElementById("goalProgress").textContent = "--";
  }
}

function renderHistory(data) {
  const list = document.getElementById("historyList");
  if (data.records.length === 0) {
    list.innerHTML = '<div class="history-empty">还没有打卡记录，快去打卡吧！</div>';
    return;
  }
  list.innerHTML = data.records.slice(0, 14).map(r => '<div class="history-item"><span class="history-date">' + formatDate(r.date) + '</span><span class="history-weight">' + r.weight + ' kg</span></div>').join("");
}

init();
