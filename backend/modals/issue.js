import mongoose from "mongoose";


const issueSchema=new mongoose.Schema({


student:{


type:mongoose.Schema.Types.ObjectId,

ref:"User"


},


book:{


type:mongoose.Schema.Types.ObjectId,

ref:"Book"


},


issueDate:{


type:Date,

default:Date.now


},


returnDate:Date,


fine:{


type:Number,

default:0


}


});


export default mongoose.model(
"Issue",
issueSchema
);