export function MeshBackground() {
  return (
    <div className="mesh-bg" aria-hidden>
      <div
        className="mesh-blob"
        style={{ width: 520, height: 520, background: "#1E6FD9", top: -160, left: -120 }}
      />
      <div
        className="mesh-blob"
        style={{ width: 480, height: 480, background: "#F5821F", top: "20%", right: -160, animationDelay: "-7s" }}
      />
      <div
        className="mesh-blob"
        style={{ width: 420, height: 420, background: "#38BDF8", bottom: -180, left: "30%", animationDelay: "-14s" }}
      />
    </div>
  );
}
