//////////////////////////
// 1. createElemWithText
//////////////////////////
function createElemWithText(elemType = "p", textContent = "", className) {
    const elem = document.createElement(elemType);
    elem.textContent = textContent;
    if (className) elem.classList.add(className);
    return elem;
}

//////////////////////////
// 2. createSelectOptions
//////////////////////////
function createSelectOptions(users) {
    if (!users) return;
    const options = [];

    for (const user of users) {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        options.push(option);
    }

    return options;
}

//////////////////////////
// 3. toggleCommentSection
//////////////////////////
function toggleCommentSection(postId) {
    if (!postId) return;
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!section) return null;
    section.classList.toggle("hide");
    return section;
}

//////////////////////////
// 4. toggleCommentButton
//////////////////////////
function toggleCommentButton(postId) {
    if (!postId) return;
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!button) return null;

    button.textContent =
        button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";

    return button;
}

//////////////////////////
// 5. deleteChildElements
//////////////////////////
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof Element)) return;
    let child = parentElement.lastElementChild;

    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }

    return parentElement;
}

//////////////////////////
// 6. addButtonListeners
//////////////////////////
function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (!buttons) return;

    buttons.forEach((button) => {
        const postId = button.dataset.postId;
        if (!postId) return;

        button.addEventListener("click", (event) =>
            toggleComments(event, postId)
        );
    });

    return buttons;
}

//////////////////////////
// 7. removeButtonListeners
//////////////////////////
function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (!buttons) return;

    buttons.forEach((button) => {
        const postId = button.dataset.postId;
        if (!postId) return;

        button.removeEventListener("click", (event) =>
            toggleComments(event, postId)
        );
    });

    return buttons;
}

//////////////////////////
// 8. createComments
//////////////////////////
function createComments(comments) {
    if (!comments) return;

    const fragment = document.createDocumentFragment();

    comments.forEach((comment) => {
        const article = document.createElement("article");

        const h3 = createElemWithText("h3", comment.name);
        const p1 = createElemWithText("p", comment.body);
        const p2 = createElemWithText("p", `From: ${comment.email}`);

        article.append(h3, p1, p2);
        fragment.append(article);
    });

    return fragment;
}

//////////////////////////
// 9. populateSelectMenu
//////////////////////////
function populateSelectMenu(users) {
    if (!users) return;

    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(users);

    options.forEach((option) => selectMenu.append(option));
    return selectMenu;
}

//////////////////////////
// 10. getUsers
//////////////////////////
async function getUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        return await response.json();
    } catch (error) {
        console.error(error);
        return;
    }
}

//////////////////////////
// 11. getUserPosts
//////////////////////////
async function getUserPosts(userId) {
    if (!userId) return;

    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        return await response.json();
    } catch (error) {
        console.error(error);
        return;
    }
}

//////////////////////////
// 12. getUser
//////////////////////////
async function getUser(userId) {
    if (!userId) return;

    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        return await response.json();
    } catch (error) {
        console.error(error);
        return;
    }
}

//////////////////////////
// 13. getPostComments
//////////////////////////
async function getPostComments(postId) {
    if (!postId) return;

    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
        );
        return await response.json();
    } catch (error) {
        console.error(error);
        return;
    }
}

//////////////////////////
// 14. displayComments
//////////////////////////
async function displayComments(postId) {
    if (!postId) return;

    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");

    const comments = await getPostComments(postId);
    const fragment = createComments(comments);

    section.append(fragment);
    return section;
}

//////////////////////////
// 15. createPosts
//////////////////////////
async function createPosts(posts) {
    if (!posts) return;

    const fragment = document.createDocumentFragment();

    for (const post of posts) {
        const article = document.createElement("article");

        const h2 = createElemWithText("h2", post.title);
        const p1 = createElemWithText("p", post.body);
        const p2 = createElemWithText("p", `Post ID: ${post.id}`);

        const author = await getUser(post.userId);
        const p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);

        // Company catch-phrase
        const p4 = createElemWithText("p", author.company.catchPhrase);

        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        const section = await displayComments(post.id);

        // Append in EXACT order (7 elements)
        article.append(h2, p1, p2, p3, p4, button, section);

        fragment.append(article);
    }

    return fragment;
}


//////////////////////////
// 16. displayPosts
//////////////////////////
async function displayPosts(posts) {
    const main = document.querySelector("main");
    if (!main) return;

    // If posts missing --> create default <p>
    const element = posts && posts.length
        ? await createPosts(posts)
        : createElemWithText("p", "Select an Employee to display their posts.", "default-text");

    main.append(element);
    return element;
}

//////////////////////////
// 17. toggleComments
//////////////////////////
function toggleComments(event, postId) {
    if (!event || !postId) return;

    event.target.listener = true;

    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section, button];
}

//////////////////////////
// 18. refreshPosts
//////////////////////////
async function refreshPosts(posts) {
    if (!posts) return;

    const removeButtons = removeButtonListeners();
    const main = document.querySelector("main");
    deleteChildElements(main);

    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];
}

//////////////////////////
// 19. selectMenuChangeEventHandler
//////////////////////////
async function selectMenuChangeEventHandler(e) {
  // If nothing at all was passed in, return undefined
  if (!e) return;

  const target = e.target || e;

  // Safely disable the select menu *only if* the property exists.
  if ("disabled" in target) {
    target.disabled = true;
  }

  // Use the value if present; otherwise default to userId 1
  const userId = Number(target.value) || 1;

  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);

  if ("disabled" in target) {
    target.disabled = false;
  }

  return [userId, posts, refreshPostsArray];
}




//////////////////////////
// 20. initPage
//////////////////////////
async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

//////////////////////////
// 21. initApp
//////////////////////////
function initApp() {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded", initApp);
