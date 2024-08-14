import PlayRandomMoveEngine from "../PlayRandomMoveEngine"

export const ComputerGame = () => {
  return (
        
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
  <div className="text-white text-3xl font-bold">
    Play against a Computer
  </div>
  <div style={{
    margin: '3rem auto',
    maxWidth: '70vh',
    width: '70vw'
  }}>
    <PlayRandomMoveEngine />
  </div>
</div>
   
)
}