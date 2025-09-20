
import YazzilWordLoader from "@/components/global/loaderPro"

const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <YazzilWordLoader state={true} />
    </div>
  )
}

export default Loading