/**
 * @flow
 */
import store, { getMessageInfo, changeTimeFormat } from './store';
// example of generating HTML with js

function addMailboxList() {
  const mailboxes = Object.keys(store.mailboxes);
  return mailboxes.map(mailbox => `
    <li class="nav-item">
      <button class="mailbox-item active" type="button" id="${mailbox}" >${mailbox}</button>
    </li>
    `).join('');
}

function renderNav() {
  const mailboxNav = `
    <ul class="nav-list">
      ${addMailboxList()}
    </ul>
  `;

  const container = document.querySelector('.nav-container');
  if (container != null) container.innerHTML = mailboxNav;
}


function renderThreads(activeMailbox = 'INBOX') {
  const inbox = store.mailboxes[activeMailbox];
  if (inbox == null) return '';
  const threadIDs = inbox.threadIds;

  return threadIDs.map((id) => {
    const [latestID] = store.threads[id].messages.slice(-1);
    const latestmessage = store.messages[latestID.id];
    const sender = getMessageInfo(latestmessage, 'From');
    const subject = getMessageInfo(latestmessage, 'Subject');
    const timestamp = getMessageInfo(latestmessage, 'Date');
    const snippet = latestmessage.snippet;

    if (sender == null || timestamp == null || subject == null) return '';

    return `
          <li>
            <button class="email-item" type="button">
              <div class="sender-details">
                <p class="sender">${sender.split('\\')[0]}</p>
                <span class="timestamp">${changeTimeFormat(timestamp)}</span>
              </div>
              <p class="email-subject">${subject}</p>
              <p class="email-snippet">${snippet}</p>
            </button>
          </li>
            `;
  }).join('');
}

function renderSidebar(activeMailbox = 'INBOX') {
  const sidebarContents = `
    <h2 class="email-header">${activeMailbox}</h2>
    <ul class="email-list">
      ${renderThreads(activeMailbox)}
    </ul>
  `;

  const container = document.querySelector('.email-list-container');
  if (container != null) container.innerHTML = sidebarContents;
}

renderSidebar();
renderNav();

function changeMailbox(evenTarget) {
  const mailboxName = evenTarget.id;
  const activeMailbox = document.querySelector('.active');
  activeMailbox.classList.remove('active');
  evenTarget.classList.add('active');
  renderSidebar(mailboxName);
}

function addClickNav() {
  const mailboxlist = document.querySelectorAll('.mailbox-item');
  mailboxlist.forEach(button =>
    button.addEventListener('click', e => changeMailbox(e.target)));
}


addClickNav();
