/*
  [INPUT]: /search-index.json（由 home 的 SearchIndex 输出格式生成）
  [OUTPUT]: 在 /search/ 页面上提供即时客户端搜索，渲染归档风格结果列表
  [POS]: 搜索页唯一脚本。无依赖、无框架、不使用 innerHTML 渲染结果。
  [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
*/
(function () {
  'use strict';

  var form = document.querySelector('[data-search-form]');
  if (!form) return;

  var input = form.querySelector('input[type="search"]');
  var status = document.querySelector('[data-search-status]');
  var list = document.querySelector('[data-search-results]');
  var endpoint = form.getAttribute('data-index') || '/search-index.json';
  var docs = null;
  var loading = null;
  var timer = null;

  var LABELS = {
    posts: '文章',
    journal: '日志'
  };

  function normalize(value) {
    return String(value || '').toLowerCase();
  }

  function load() {
    if (docs) return Promise.resolve(docs);
    if (loading) return loading;

    status.textContent = '正在加载索引…';
    loading = fetch(endpoint, { headers: { Accept: 'application/json' } })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        docs = data;
        status.textContent = '输入关键词开始搜索…';
        return docs;
      })
      .catch(function (error) {
        loading = null;
        status.textContent = '搜索索引加载失败。';
        console.error('搜索索引加载失败：', error);
        return [];
      });

    return loading;
  }

  function score(doc, terms) {
    var title = normalize(doc.title);
    var tags = normalize((doc.tags || []).join(' '));
    var content = normalize(doc.content);
    var total = 0;

    for (var i = 0; i < terms.length; i += 1) {
      var term = terms[i];
      if (title.indexOf(term) !== -1) total += 100;
      else if (tags.indexOf(term) !== -1) total += 40;
      else if (content.indexOf(term) !== -1) total += 10;
      else return 0;
    }

    return total;
  }

  function render(results, query) {
    list.textContent = '';

    if (!query) {
      status.textContent = '输入关键词开始搜索…';
      return;
    }

    status.textContent = results.length
      ? '找到 ' + results.length + ' 条结果：“' + query + '”'
      : '没有找到“' + query + '”的相关内容';

    results.forEach(function (doc) {
      var item = document.createElement('li');
      var hit = document.createElement('span');
      var kind = document.createElement('span');
      var link = document.createElement('a');
      var time = document.createElement('time');

      hit.className = 'search-hit';
      kind.className = 'search-section';
      kind.textContent = LABELS[doc.section] || doc.section;
      link.href = doc.url;
      link.textContent = doc.title;
      time.setAttribute('datetime', doc.dateISO);
      time.textContent = doc.date;

      hit.appendChild(kind);
      hit.appendChild(link);
      item.appendChild(hit);
      item.appendChild(time);
      list.appendChild(item);
    });
  }

  function search() {
    var query = input.value.trim();
    var terms = normalize(query).split(/\s+/).filter(Boolean);

    if (!query) {
      render([], '');
      return;
    }

    load().then(function (data) {
      var results = data
        .map(function (doc) {
          return { doc: doc, score: score(doc, terms) };
        })
        .filter(function (entry) { return entry.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 50)
        .map(function (entry) { return entry.doc; });

      render(results, query);
    });
  }

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(search, 120);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearTimeout(timer);
    search();
  });

  var initial = new URLSearchParams(window.location.search).get('q');
  if (initial) {
    input.value = initial;
    search();
  } else {
    load();
  }
})();
