/**
 * @flow
 */
import store, { getMessageInfo, changeTimeFormat } from './store';
// example of generating HTML with js
//
function renderThreads() {
  const inbox = store.mailboxes.INBOX;
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


function renderSidebar() {
  const sidebarContents = `
    <h2 class="email-header">Inbox</h2>
    <ul class="email-list">
      ${renderThreads()}
    </ul>
  `;

  const container = document.querySelector('.email-list-container');
  if (container != null) container.innerHTML = sidebarContents;
}

renderSidebar();
