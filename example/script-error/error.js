function clickHandle() {
  var b = a.c
}

console.log(mai)

mai.init({
  report: function(errorLogs) {
    console.table(errorLogs)
    console.log('发送请求')
  }
})

var clickHandleTry = mai.tryJS.wrap(clickHandle)
document.querySelector('.send').addEventListener('click', clickHandleTry)


function goHome(type, callback) {
  console.log(type)

  callback()
}

// goHome = tryJS.wrap(goHome)
// goHome(4, function() {
//   console.log('done')
//   console.log(ming = tian)
// })

(mai.tryJS.wrapArgs(goHome))(4, function() {
  console.log('done')
  ming = tian
})
