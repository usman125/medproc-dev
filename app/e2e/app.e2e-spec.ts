import { RestablePage } from './app.po';

describe('restable App', () => {
  let page: RestablePage;

  beforeEach(() => {
    page = new RestablePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
