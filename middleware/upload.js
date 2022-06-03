const multer=require('multer')//multer le file upload garne server ma-first we import multer
const fs=require('fs')//fs is file system
const path=require('path')//here we defining path to save where


//storage le kaha store garne//k name storne garne 
//basically file ko path ra name dine kam storage le garcha
const storage=multer.diskStorage({//esle path kata gayera store garne ra filename k dine bhanera const storage ko kam ho
    destination:(req,file,cb)=>{//here cb is call function
        let fileDestination='public/uploads/'//yo tai ka gayera save garne  provdes us files destination
        //check if directory exists
       //here if else is optional public/upload folder chaina bhane banaidincha
        if(!fs.existsSync(fileDestination)){
            fs.mkdirSync(fileDestination,{recursive:true})
            //recursive:true means it creates parent folder as well as sub folder
            cb(null,fileDestination)
        }
        else{
            cb(null,fileDestination)//hamile file destination call garya ho
        }

    },
    filename:(req,file,cb)=>{
        let filename=path.basename(file.originalname,path.extname(file.originalname))
        //path.basename(folder/abc.jpg)
        //return abc.jpg
        //path.basename(folder/abc.jpg,.jpg)
        //return abc
        let ext=path.extname(file.originalname)
        cb(null,filename + '_'+ Date.now()+ext)//yo tai filename kasari rakhne 
        //abc_fulldate.jpg to tai callback huncha

    
    }

})

let imageFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|png|gif|jpeg|svg|JPG|PNG|GIF|JPEG|SVG|jfif)$/)){
        return cb(new Error('You can upload image file only'),false)//here yesto format aunu parcha so noit will return us error


    }
    else{
        cb(null,true)
    }
}

let upload=multer({//
    storage:storage,
    fileFilter:imageFilter,
    limits:{
        fileSize:4000000 //4MB//maximum allowed size here we can increased it
    }
})

module.exports=upload