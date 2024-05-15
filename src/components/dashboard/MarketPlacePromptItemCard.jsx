import { useMutation, useQueryClient } from "react-query";
import { arrayRemove, arrayUnion, doc, increment, updateDoc } from "firebase/firestore";
import { firestoreDB } from "../../config/firebase";
import { useAuthContext } from "../../context/authContext";
import { GrCloudDownload } from "react-icons/gr";
import { successToast } from "../../utils/notify";
import { toast } from "react-toastify";
const MarketPlacePromptItemCard = ({data}) => {
  const {title,prompt,date_created,likes_count,id} =data
  const {user,userData} = useAuthContext()

  const likedPosts = userData.likedPosts || [];
  const savedPosts = userData.savedPosts || [];
  const liked=likedPosts.includes(id);
       const saved=savedPosts.includes(id);
  const queryClient = useQueryClient()
  const isCurrentPromptInUse = userData?.post_id===id 
//   const likePostMutation = useMutation({
//     mutationFn: async() => {
//       const postRef = doc(firestoreDB, "posts",id)
//       const userRef = doc(firestoreDB, "users",user?.uid)
//       const postUpdate = await updateDoc(postRef,{likes_count:increment(liked?-1 :1)})
//       const userUpdate = await updateDoc(userRef,{likedPosts:liked?arrayRemove(id):arrayUnion(id)})
//       await queryClient.invalidateQueries({ queryKey: ['userData'] })
//     },
//   })
  const savePostMutation = useMutation({
    mutationFn: async() => {
      const userRef = doc(firestoreDB, "users",user?.uid)
      const userUpdate = await updateDoc(userRef,{savedPosts:saved?arrayRemove(id):arrayUnion(id)})
      console.log(userUpdate)
      await queryClient.invalidateQueries({ queryKey: ['userData'] })

    },
  })
//   const usePromptMutation = useMutation({
//     mutationFn: async() => {
//       const userRef = doc(firestoreDB, "users",user?.uid)
//       const userUpdate = await updateDoc(userRef,{prompt,post_id:id,})
//       await queryClient.invalidateQueries({queryKey:["userData"]})
//       successToast("Prompt updated successfully!!")
//     },
//   })
  return (
    <div key={data.id} className="promptCard">
    <h1>{data.title}</h1>
    <h2>{data.prompt.slice(0,80)}...</h2>
    <button
    onClick={()=>{if(!savePostMutation.isLoading){toast.promise(savePostMutation.mutateAsync(),{pending:"Saving the prompt"})}}}
      className="sidebarButton bg-transparent"
      style={{ width: "90%", minWidth: "10rem", margin: "0" }}
    >
      <GrCloudDownload
        style={{ marginRight: "1rem" }}
      ></GrCloudDownload>
        <h1 style={{ fontSize: "1rem" }}>Download</h1>
    </button>
  </div>
  );
};

export default MarketPlacePromptItemCard;
