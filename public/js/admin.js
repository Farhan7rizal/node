const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  console.log(btn.parentNode.querySelector('[name=productId]').value);

  fetch('/admin/product/' + prodId, {
    method: 'DELETE',
    headers: {
      token: 'ini_token',
    },
  })
    .then((result) => {
      console.log('result');
    })
    .catch((err) => {
      console.log(err);
    });
};
