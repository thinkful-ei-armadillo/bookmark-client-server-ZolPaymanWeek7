function makeBookmarkArray() {
  return [
    {
      id: 1,
      title: 'hey',
      url: 'https://google.com',
      rating: 1,
      description: 'wuddup playa'
    },
    {
      id: 2,
      title: 'yo wuddup b',
      url: 'https://thinkful.com',
      rating: 3,
      description: 'yo jus chillin'
    }
  ];
}
function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    rating: 1,
    url: 'https://google.com',
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  };
  const expectedBookmark = {
    ...maliciousBookmark,
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousBookmark,
    expectedBookmark
  };
}
module.exports = { makeBookmarkArray, makeMaliciousBookmark };
