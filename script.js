// 수정: 동아리 활동 내용을 자신의 실제 활동 기록으로 바꿔 보세요.
const activityData = [
  {
    date: "3월",
    title: "HTML, CSS, Javascript 구조 익히기",
    description: "제목, 링크를 사용해 웹 페이지를 만들었습니다.",
  },
  {
    date: "4월",
    title: "CSS로 화면 꾸미기",
    description: "색상, 여백, 카드 레이아웃을 조절하며 읽기 쉬운 화면을 구성했습니다.",
  },
  {
    date: "5월",
    title: "비디오 게임 설계하기",
    description: "게임 구현에 필요한 기본 코드를 익히고, 컨셉, 스타일, 그래픽 등을 설계합니다.",
  },
  {
    date: "6월",
    title: "AI 도구를 이용한 설계 구현",
    description: "버튼을 클릭하면 화면이 바뀌는 간단한 기능을 구현했습니다.",
  },
];

// 수정: 프로젝트 제목, 설명, 분류(category), 태그(tags)를 자신의 프로젝트로 바꿔 보세요.
// category는 필터 버튼의 data-filter 값(web, ai, data)과 맞추면 됩니다.
const projectData = [
  {
    title: "나를 소개하는 웹 페이지",
    description: "HTML과 CSS를 사용해 자기소개, 관심 분야, 목표를 정리한 첫 페이지입니다.",
    category: "web",
    icon: "WEB",
    tags: ["HTML", "CSS", "기초"],
  },
  {
    title: "AI 아이디어 노트",
    description: "AI에게 질문하고 받은 답변을 비교하며 좋은 프롬프트의 조건을 정리했습니다.",
    category: "ai",
    icon: "AI",
    tags: ["AI", "프롬프트", "기록"],
  },
  {
    title: "학습 시간 데이터 보기",
    description: "간단한 표와 숫자를 보고 나의 학습 패턴을 설명하는 미니 프로젝트입니다.",
    category: "data",
    icon: "DATA",
    tags: ["데이터", "분석", "시각화"],
  },
  {
    title: "클릭 반응 카드",
    description: "JavaScript로 버튼과 카드가 반응하도록 만들어 웹 페이지에 생동감을 더했습니다.",
    category: "web",
    icon: "JS",
    tags: ["JavaScript", "이벤트", "인터랙션"],
  },
];

// 수정: 처음 화면에 보여 줄 예시 기록입니다. 학생 개인 기록으로 바꿔도 좋습니다.
const starterNoteData = [
  {
    id: "sample-1",
    date: "예시 기록",
    category: "실습",
    title: "첫 포트폴리오 구조 만들기",
    content: "HTML 섹션을 나누고 자기소개, 활동, 프로젝트 영역을 만들었습니다.",
  },
  {
    id: "sample-2",
    date: "예시 기록",
    category: "AI 활용",
    title: "AI에게 질문해 보기",
    content: "목표와 조건을 분명하게 적으면 더 쓸모 있는 답변을 받을 수 있다는 점을 배웠습니다.",
  },
];

const notesStorageKey = "ysPortfolioNotes";

const activityTimeline = document.querySelector("#activityTimeline");
const projectGrid = document.querySelector("#projectGrid");
const filterButtons = document.querySelectorAll(".filter-button");
const noteForm = document.querySelector("#noteForm");
const noteList = document.querySelector("#noteList");
const noteCount = document.querySelector("#noteCount");
const noteTitle = document.querySelector("#noteTitle");

let portfolioNotes = loadNotes();

function renderActivities() {
  activityTimeline.innerHTML = activityData
    .map(
      (activity) => `
        <article class="activity-item">
          <div class="activity-date">${activity.date}</div>
          <div>
            <h3>${activity.title}</h3>
            <p>${activity.description}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderProjects(filter = "all") {
  const filteredProjects =
    filter === "all"
      ? projectData
      : projectData.filter((project) => project.category === filter);

  projectGrid.innerHTML = filteredProjects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-icon" aria-hidden="true">${project.icon}</div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function loadNotes() {
  try {
    const savedNotes = localStorage.getItem(notesStorageKey);
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      if (Array.isArray(parsedNotes)) {
        return parsedNotes;
      }
    }
  } catch (error) {
    return [...starterNoteData];
  }

  return [...starterNoteData];
}

function saveNotes() {
  try {
    localStorage.setItem(notesStorageKey, JSON.stringify(portfolioNotes));
  } catch (error) {
    // 저장이 막힌 브라우저에서도 현재 화면에는 기록이 바로 보이도록 둡니다.
  }
}

function getTodayText() {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderNotes() {
  if (!noteList || !noteCount) {
    return;
  }

  noteCount.textContent = `${portfolioNotes.length}개`;

  if (portfolioNotes.length === 0) {
    noteList.innerHTML = `
      <p class="empty-notes">
        아직 기록이 없습니다. 왼쪽 입력칸에 오늘의 활동을 적어 보세요.
      </p>
    `;
    return;
  }

  noteList.innerHTML = portfolioNotes
    .map(
      (note) => `
        <article class="note-card">
          <div class="note-card-top">
            <span class="note-category">${escapeHTML(note.category)}</span>
            <time>${escapeHTML(note.date)}</time>
          </div>
          <h3>${escapeHTML(note.title)}</h3>
          <p>${escapeHTML(note.content)}</p>
          <button class="note-delete" type="button" data-id="${escapeHTML(note.id)}">
            삭제
          </button>
        </article>
      `
    )
    .join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

if (noteForm) {
  noteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(noteForm);
    const title = formData.get("title").trim();
    const category = formData.get("category");
    const content = formData.get("content").trim();

    if (!title || !content) {
      return;
    }

    portfolioNotes.unshift({
      id: `${Date.now()}`,
      date: getTodayText(),
      category,
      title,
      content,
    });

    saveNotes();
    renderNotes();
    noteForm.reset();
    noteTitle.focus();
  });
}

if (noteList) {
  noteList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".note-delete");
    if (!deleteButton) {
      return;
    }

    portfolioNotes = portfolioNotes.filter((note) => note.id !== deleteButton.dataset.id);
    saveNotes();
    renderNotes();
  });
}

renderActivities();
renderProjects();
renderNotes();