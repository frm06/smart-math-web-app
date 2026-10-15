const $ = (id) => document.getElementById(id);
const show = (id, visible) => $(id).classList.toggle("hidden", !visible);
const numberValue = (id) => {
  const raw = $(id).value.trim();
  return raw === "" ? null : Number(raw);
};
const formatNumber = (n) => Number.isInteger(n) ? String(n) : String(Number(n.toFixed(6)));

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b === button));
    document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === button.dataset.tab));
  });
});

// 1-6. Luas, keliling, dan pengaturan input
function updateGeometryFields() {
  const type = $("calcType").value;
  const shape = $("shape").value;
  let labels = ["Sisi", "Input 2", "Input 3"];
  let visible = [true, false, false];

  if (shape === "Persegi Panjang") {
    labels = ["Panjang", "Lebar", "Input 3"];
    visible = [true, true, false];
  } else if (shape === "Segitiga" && type === "Hitung Luas") {
    labels = ["Alas", "Tinggi", "Input 3"];
    visible = [true, true, false];
  } else if (shape === "Segitiga" && type === "Hitung Keliling") {
    labels = ["Sisi 1", "Sisi 2", "Sisi 3"];
    visible = [true, true, true];
  }
  [1,2,3].forEach((n, i) => {
    const label = $(`field${n}Label`);
    label.firstChild.textContent = labels[i];
    show(`field${n}Label`, visible[i]);
    if (!visible[i]) $(`number${n}`).value = "";
  });
}
$("calcType").addEventListener("change", updateGeometryFields);
$("shape").addEventListener("change", updateGeometryFields);
$("calculateBtn").addEventListener("click", () => {
  const type = $("calcType").value, shape = $("shape").value;
  const a = numberValue("number1"), b = numberValue("number2"), c = numberValue("number3");
  const need = shape === "Persegi" ? [a] : shape === "Persegi Panjang" || (shape === "Segitiga" && type === "Hitung Luas") ? [a,b] : [a,b,c];
  if (need.some(v => v === null || !Number.isFinite(v) || v < 0)) {
    $("geometryResult").textContent = shape === "Persegi" ? "Masukkan panjang sisi." :
      shape === "Persegi Panjang" ? "Masukkan panjang dan lebar." :
      type === "Hitung Luas" ? "Masukkan alas dan tinggi." : "Masukkan sisi 1, sisi 2, dan sisi 3.";
    return;
  }
  let result, label;
  if (type === "Hitung Luas") {
    result = shape === "Persegi" ? a*a : shape === "Persegi Panjang" ? a*b : 0.5*a*b;
    label = `Luas ${shape.toLowerCase()}`;
  } else {
    result = shape === "Persegi" ? 4*a : shape === "Persegi Panjang" ? 2*(a+b) : a+b+c;
    label = `Keliling ${shape.toLowerCase()}`;
  }
  $("geometryResult").textContent = `${label} = ${formatNumber(result)}`;
});
updateGeometryFields();

// 7. Kategori nilai
$("gradeBtn").addEventListener("click", () => {
  const value = numberValue("gradeInput");
  if (value === null) return $("gradeResult").textContent = "Masukkan nilai terlebih dahulu.";
  if (!Number.isFinite(value)) return $("gradeResult").textContent = "Nilai tidak valid.";
  const category = value >= 90 ? "Sangat Baik" : value >= 75 ? "Baik" : value >= 60 ? "Cukup" : "Perlu Latihan";
  $("gradeResult").textContent = category;
});

// 8-10. Pengolahan data, analisis, pencarian
function parseData() {
  const text = $("dataInput").value.trim();
  if (!text) return [];
  const parts = text.split(",").map(x => x.trim());
  if (parts.some(x => x === "" || !Number.isFinite(Number(x)))) return [];
  return parts.map(Number);
}
$("analyzeBtn").addEventListener("click", () => {
  const data = parseData();
  if (!data.length) return $("analysisResult").textContent = "Data tidak valid atau masih kosong.";
  const sorted = [...data].sort((a,b) => a-b);
  const average = data.reduce((sum, n) => sum+n, 0) / data.length;
  $("analysisResult").textContent =
`Data asli:
[${data.join(", ")}]

Data setelah diurutkan:
[${sorted.join(", ")}]

Nilai maksimum:
${Math.max(...data)}

Nilai minimum:
${Math.min(...data)}

Jumlah data:
${data.length}

Rata-rata:
${average.toFixed(2)}`;
});
$("searchBtn").addEventListener("click", () => {
  const data = parseData(), target = numberValue("targetInput");
  if (!data.length) return $("searchResult").textContent = "Data tidak valid atau masih kosong.";
  if (target === null || !Number.isFinite(target)) return $("searchResult").textContent = "Masukkan nilai yang ingin dicari.";
  const positions = data.map((value, i) => value === target ? i+1 : null).filter(x => x !== null);
  if (!positions.length) $("searchResult").textContent = `Nilai ${target} tidak ditemukan dalam data.`;
  else if (positions.length === 1) $("searchResult").textContent = `Nilai ${target} ditemukan.\nNilai tersebut terdapat pada data ke-${positions[0]}.`;
  else $("searchResult").textContent = `Nilai ${target} ditemukan sebanyak ${positions.length} kali.\nNilai tersebut terdapat pada ${positions.map(p => `data ke-${p}`).join(", ")}.`;
});

// 11. Faktorial (iterasi menghindari batas kedalaman rekursi browser)
$("factorialBtn").addEventListener("click", () => {
  const n = numberValue("factorialInput");
  if (n === null) return $("factorialResult").textContent = "Masukkan bilangan.";
  if (n < 0) return $("factorialResult").textContent = "Bilangan harus 0 atau lebih.";
  if (!Number.isInteger(n)) return $("factorialResult").textContent = "Masukkan bilangan bulat.";
  if (n > 170) return $("factorialResult").textContent = "Masukkan bilangan 0 sampai 170 agar hasil dapat ditampilkan sebagai angka.";
  let result = 1;
  for (let i=2; i<=n; i++) result *= i;
  $("factorialResult").textContent = `${n}! = ${result}`;
});

// 12-15. Quiz
const questions = [
  {question:"Berapakah luas persegi dengan panjang sisi 5 cm?", options:["20 cm²","25 cm²","30 cm²","35 cm²"], answer:"25 cm²"},
  {question:"Berapakah keliling persegi dengan panjang sisi 6 cm?", options:["12 cm","18 cm","24 cm","36 cm"], answer:"24 cm"},
  {question:"Berapakah luas persegi panjang dengan panjang 10 cm dan lebar 5 cm?", options:["15 cm²","30 cm²","50 cm²","100 cm²"], answer:"50 cm²"},
  {question:"Berapakah luas segitiga dengan alas 10 cm dan tinggi 8 cm?", options:["20 cm²","40 cm²","80 cm²","100 cm²"], answer:"40 cm²"},
  {question:"Berapakah hasil dari 5! (5 faktorial)?", options:["25","60","100","120"], answer:"120"}
];
let quizIndex = 0, quizScore = 0, checked = false;
function renderQuiz() {
  $("quizCounter").textContent = `Soal ${quizIndex+1} dari ${questions.length}`;
  $("quizScore").textContent = `Skor: ${quizScore}`;
  $("progressBar").style.width = `${(quizIndex+1)/questions.length*100}%`;
  $("questionText").textContent = questions[quizIndex].question;
  $("answerOptions").innerHTML = "";
  questions[quizIndex].options.forEach((option, i) => {
    const label = document.createElement("label");
    label.className = "option";
    const radio = document.createElement("input");
    radio.type = "radio"; radio.name = "quizAnswer"; radio.value = option;
    radio.addEventListener("change", () => {
      document.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
      label.classList.add("selected");
    });
    label.append(radio, document.createTextNode(option));
    $("answerOptions").appendChild(label);
  });
  $("quizResult").textContent = "Pilih jawaban, kemudian tekan Periksa Jawaban.";
  $("checkAnswerBtn").disabled = false;
  $("nextQuestionBtn").disabled = true;
  show("nextQuestionBtn", quizIndex < questions.length-1);
  show("restartQuizBtn", false);
  checked = false;
}
$("checkAnswerBtn").addEventListener("click", () => {
  if (checked) return $("quizResult").textContent = "Jawaban sudah diperiksa. Silakan lanjut ke soal berikutnya.";
  const selected = document.querySelector('input[name="quizAnswer"]:checked');
  if (!selected) return $("quizResult").textContent = "Silakan pilih jawaban terlebih dahulu.";
  const correct = selected.value === questions[quizIndex].answer;
  if (correct) {
    quizScore += 20;
    $("quizResult").textContent = "✅ Benar!\nKamu mendapatkan 20 poin.";
  } else {
    $("quizResult").textContent = `❌ Jawaban belum tepat.\nJawaban yang benar adalah ${questions[quizIndex].answer}.`;
  }
  checked = true;
  document.querySelectorAll('input[name="quizAnswer"]').forEach(input => input.disabled = true);
  document.querySelectorAll(".option").forEach(el => el.classList.add("disabled"));
  $("quizScore").textContent = `Skor: ${quizScore}`;
  $("checkAnswerBtn").disabled = true;
  if (quizIndex < questions.length-1) $("nextQuestionBtn").disabled = false;
  else {
    $("quizResult").textContent += `\n\n🎉 Quiz selesai!\nTotal skor kamu: ${quizScore} dari 100.`;
    show("restartQuizBtn", true);
  }
});
$("nextQuestionBtn").addEventListener("click", () => {
  if (quizIndex < questions.length-1) { quizIndex++; renderQuiz(); }
});
$("restartQuizBtn").addEventListener("click", () => {
  quizIndex = 0; quizScore = 0; renderQuiz();
});
renderQuiz();
