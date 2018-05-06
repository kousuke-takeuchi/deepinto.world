import { Article } from './article';


test('parse article file url', () => {
  const article = new Article('2014-12-11_確率論の小話.md');
  console.log(article.title);
  console.log(article.date);
  console.log(article.url);
  expect(article.title).toBe('確率論の小話');
});
