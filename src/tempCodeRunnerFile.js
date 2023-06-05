QRCode.toDataURL('http://localhost:3000/userinfo', function (err, url) {
  if (err) throw err
  console.log(url)
})