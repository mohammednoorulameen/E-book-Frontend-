import axios from 'axios';

export const imageUploadCloudinery =  async(file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'l0vic9gj');

        const res = await axios.post("https://api.cloudinary.com/v1_1/dw7wfjws3/image/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data.secure_url; // Return the image URL
}catch(error){
    console.error('Error uploading image:', error);
    throw new Error('Image could not be uploaded');
}

}
