export const handleClickHelp = () => {
  const element = document.getElementsByClassName('cc-nsge')[0];

  if (element) {
    (element as HTMLElement).click();
  }
};
