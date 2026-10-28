const editor = document.querySelector('#log-editor');
const form = document.querySelector('#story-form');
const writeButton = document.querySelector('#btn-write-story');
const downloadButton = document.querySelector('#btn-download-story');
const status = document.querySelector('#status');
const title = document.querySelector('#story-title');
const scenes = document.querySelector('#scenes');
const sourceList = document.querySelector('#source-events');
const sourcePanel = document.querySelector('#source-panel');
const emptyStory = document.querySelector('#empty-story');
const meta = document.querySelector('#story-meta');
let sampleLog = '';
let result = null;
let busy = false;

function message(text, error = false) {
  status.textContent = text;
  status.classList.toggle('error', error);
}

function countEvents() {
  const count = editor.value.split('\n').filter(line => line.trim()).length;
  document.querySelector('#event-count').textContent = `${count} event${count === 1 ? '' : 's'}`;
  return count;
}

function clearStory() {
  result = null;
  scenes.replaceChildren();
  sourceList.replaceChildren();
  sourcePanel.hidden = true;
  downloadButton.disabled = true;
  emptyStory.hidden = false;
  title.textContent = 'The story is still in the dark.';
  meta.textContent = 'Three scenes · Two moods';
}

function inputChanged() {
  countEvents();
  clearStory();
  message('Ready when you are.');
}

function showEvent(id, button) {
  document.querySelectorAll('.reference').forEach(ref => ref.setAttribute('aria-pressed', 'false'));
  document.querySelectorAll('#source-events li').forEach(row => row.classList.remove('selected'));
  const row = document.querySelector(`#event-${id}`);
  row.classList.add('selected');
  button.setAttribute('aria-pressed', 'true');
  row.scrollIntoView({behavior: 'instant', block: 'center'});
  row.focus({preventScroll: true});
}

function renderStory(data) {
  result = data;
  title.textContent = data.story.title;
  emptyStory.hidden = true;
  sourcePanel.hidden = false;
  data.events.forEach(event => {
    const row = document.createElement('li');
    row.id = `event-${event.id}`;
    row.tabIndex = -1;
    const number = document.createElement('span');
    number.className = 'event-id';
    number.textContent = `E${event.id}`;
    const text = document.createElement('span');
    text.textContent = event.text;
    row.append(number, text);
    sourceList.append(row);
  });
  data.story.scenes.forEach((scene, index) => {
    const section = document.createElement('section');
    section.className = 'scene';
    section.setAttribute('aria-label', `Scene ${index + 1}`);
    const prose = document.createElement('p');
    prose.textContent = scene.text;
    const references = document.createElement('div');
    references.className = 'references';
    scene.source_ids.forEach(id => {
      const event = data.events.find(item => item.id === id);
      const button = document.createElement('button');
      button.className = 'reference';
      button.type = 'button';
      button.textContent = `↗ Event ${id}`;
      button.title = event.text;
      button.setAttribute('aria-label', `Show event ${id}: ${event.text}`);
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => showEvent(id, button));
      references.append(button);
    });
    section.append(prose, references);
    scenes.append(section);
  });
  downloadButton.disabled = false;
  meta.textContent = `3 scenes · ${data.events.length} source events`;
}

editor.addEventListener('input', inputChanged);
document.querySelectorAll('[name=mood]').forEach(radio => radio.addEventListener('change', inputChanged));
document.querySelector('#btn-load-sample').addEventListener('click', () => {
  editor.value = sampleLog;
  inputChanged();
  message('Fictional sample loaded. Choose a mood and write a story.');
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  const count = countEvents();
  if (count < 3 || count > 24 || editor.value.split('\n').some(line => line.trim().length > 240)) {
    message('Use 3–24 events, up to 240 characters per line.', true);
    editor.focus();
    return;
  }
  const payload = {log: editor.value, mood: form.elements.mood.value};
  clearStory();
  busy = true;
  form.querySelectorAll('button, input, textarea').forEach(control => { control.disabled = true; });
  document.querySelector('#story-panel').setAttribute('aria-busy', 'true');
  writeButton.textContent = 'Listening to the night…';
  message('Writing with the local model. This can take up to three minutes.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 185000);
  try {
    const response = await fetch('/api/story', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload), signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not create a story. Try again.');
    renderStory(data);
    message('Your fictional story is ready. Follow an event link to see its inspiration.');
  } catch (error) {
    message(error.name === 'AbortError' ? 'The local model took too long. Wait a moment, then try again.' : error.message, true);
  } finally {
    clearTimeout(timeout);
    busy = false;
    form.querySelectorAll('button, input, textarea').forEach(control => { control.disabled = false; });
    writeButton.textContent = 'Write a ghost story';
    document.querySelector('#story-panel').setAttribute('aria-busy', 'false');
  }
});

downloadButton.addEventListener('click', () => {
  if (!result) return;
  const lines = [result.story.title, '', 'FICTION — inspired by the supplied event log.',
    'References show inspiration, not factual evidence.', '',
    ...result.story.scenes.flatMap((scene, i) => [`Scene ${i + 1}`, scene.text,
      `Inspired by: ${scene.source_ids.map(id => `E${id}`).join(', ')}`, '']),
    'ORIGINAL EVENT LOG', ...result.events.map(event => `E${event.id}: ${event.text}`),
    '', `Generated locally with ${result.model} using Last Light.`, ''];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], {type: 'text/plain;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'last-light-story.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

async function start() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) throw new Error('The local desk is unavailable. Reload the page.');
    const health = await response.json();
    sampleLog = health.sample_log;
    editor.value = sampleLog;
    countEvents();
    writeButton.disabled = false;
    message('Fictional sample loaded. Choose a mood and write a story.');
  } catch (error) {
    message(error.message, true);
  }
}
start();
