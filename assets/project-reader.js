(() => {

  const params = new URLSearchParams(window.location.search);

  const projectId = params.get("project");

  const project = window.PROJECTS?.[projectId];

  if (!project) {

    document.getElementById("projectContent").innerHTML = `
      <h1>Project not found</h1>
      <p>This project does not exist.</p>
      <a href="projects.html">Back to projects</a>
    `;

    return;
  }


  const docs = project.docs;

  const contentEl = document.getElementById("projectContent");

  const sidebarEl = document.getElementById("projectDocList");

  const sidebarHeader = document.getElementById("projectSidebar");

  const tocEl = document.getElementById("projectTocLinks");

  const navEl = document.getElementById("projectNav");

  const crumbEl = document.getElementById("projectCrumb");

  const actionsEl = document.getElementById("projectActions");


  let currentIndex = 0;


  // Sidebar project information

  sidebarHeader.innerHTML = `
    <div class="side-label">${project.category}</div>

    <h2 class="side-title">${project.title}</h2>

    <p class="side-description">
      ${project.description}
    </p>
  `;


  // GitHub button

  actionsEl.innerHTML = `
    <a
      class="btn"
      href="${project.github}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>↗</span>
      View on GitHub
    </a>
  `;


  // Generate sidebar

  function renderSidebar(filter = "") {

    sidebarEl.innerHTML = "";

    docs.forEach((doc, index) => {

      if (
        !doc.title.toLowerCase().includes(filter.toLowerCase())
      ) {
        return;
      }

      const button = document.createElement("button");

      button.className = "lesson-item";

      if (index === currentIndex) {
        button.classList.add("active");
      }

      button.innerHTML = `
        <span class="lesson-number">
          ${String(index + 1).padStart(2, "0")}
        </span>

        <span class="lesson-title">
          ${doc.title}
        </span>
      `;

      button.addEventListener("click", () => {

        renderDocument(index);

        document
          .getElementById("readerSidebar")
          .classList.remove("open");

      });

      sidebarEl.appendChild(button);

    });

  }


  // Render document

  function renderDocument(index) {

    currentIndex = index;

    const doc = docs[index];

    renderSidebar(
      document.getElementById("projectSearch").value
    );


    // Breadcrumb

    crumbEl.innerHTML = `
      <a href="projects.html">Projects</a>
      / ${project.title}
      / ${doc.title}
    `;


    // Main content

    contentEl.innerHTML = `

      <div class="lesson-meta">
        <span>${project.category}</span>
      </div>

      <h1>${doc.title}</h1>

      <div class="prose">
        ${doc.content}
      </div>

    `;


    // Generate TOC

    tocEl.innerHTML = "";

    const headings = contentEl.querySelectorAll("h2, h3");

    headings.forEach((heading, i) => {

      const id = `project-heading-${i}`;

      heading.id = id;

      const link = document.createElement("a");

      link.href = `#${id}`;

      link.textContent = heading.textContent;

      link.style.display = "block";

      link.style.margin = "10px 0";

      link.style.fontSize = "12px";

      link.style.color = "var(--muted)";

      link.addEventListener("click", (e) => {

        e.preventDefault();

        heading.scrollIntoView({
          behavior: "smooth"
        });

      });

      tocEl.appendChild(link);

    });


    // Previous and next

    navEl.innerHTML = "";

    if (index > 0) {

      const previous = document.createElement("button");

      previous.className = "navlesson";

      previous.innerHTML = `
        <div class="kicker">PREVIOUS</div>
        <strong>${docs[index - 1].title}</strong>
      `;

      previous.onclick = () => renderDocument(index - 1);

      navEl.appendChild(previous);

    }


    if (index < docs.length - 1) {

      const next = document.createElement("button");

      next.className = "navlesson next";

      next.innerHTML = `
        <div class="kicker">NEXT</div>
        <strong>${docs[index + 1].title}</strong>
      `;

      next.onclick = () => renderDocument(index + 1);

      navEl.appendChild(next);

    }

    // Update URL without reload

    const url = new URL(window.location);

    url.searchParams.set("project", projectId);

    url.searchParams.set("doc", index);

    window.history.replaceState({}, "", url);


    // Scroll to top

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // Sidebar search

  document
    .getElementById("projectSearch")
    .addEventListener("input", (e) => {

      renderSidebar(e.target.value);

    });


  // Mobile sidebar

  document
    .getElementById("mobileMenu")
    .addEventListener("click", () => {

      document
        .getElementById("readerSidebar")
        .classList.toggle("open");

    });


  // Load requested doc from URL

  const requestedDoc = Number(params.get("doc") || 0);

  renderDocument(
    Number.isInteger(requestedDoc) &&
    requestedDoc >= 0 &&
    requestedDoc < docs.length
      ? requestedDoc
      : 0
  );

})();