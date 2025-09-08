import {v2 as cloudinary} from "cloudinary";
import { NextResponse } from "next/server";
export const runtime = "nodejs";

//configure cloudinary with env var
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBufferToCloudinary(buffer:Buffer,fileName = "upload.pdf"){
  return new Promise<any>((resolve,reject)=>{
    const uploadStream = cloudinary.uploader.upload_stream(
      {resource_type:"raw", folder:"pdf_uploads"},
      (error,result)=>{
        if(error) return reject(error);
        return resolve(result);
      }
    );
    uploadStream.end(buffer);
  })
}

export async function POST(req:Request){
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if(!file){
      return NextResponse.json({error:"No file provided"},{status:401});
    }

    //server side validation
    const maxBytes = 20*1024*1024; //20mb
    if(file.size > maxBytes){
      return NextResponse.json({error:"File to large (max 20MB)"},{status:400});
    }

    if(!file.type?.startsWith("application/pdf")){
      return NextResponse.json({error:"Only pdf allowed"},{status:400});
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadBufferToCloudinary(buffer,(file as any).name ?? "upload.pdf");
    
    return NextResponse.json({ok:true,asset:result},{status:200});
  } catch (error) {
    console.error("Upload error:",error);
    return NextResponse.json({error:"upload failed"},{status:500});
  }
}