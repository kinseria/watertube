const ytt = require('node-ytt');
 
ytt((response) => {
    if(response instanceof Error)
        throw response
    console.log(response)
})