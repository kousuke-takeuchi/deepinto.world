import moment from 'moment';


export class Article {
  constructor(url) {
    this.url = url;
    const { date, title } = this.parseTitle(url);
    this.date = date;
    this.title = title;
  }

  parseTitle(url) {
    const partials = url.split('_');
    const dateString = partials[0];
    const date = moment.format(dateString, 'YYYY-MM-DD');
    const title = partials[1];
    return { date, title }
  }
}
