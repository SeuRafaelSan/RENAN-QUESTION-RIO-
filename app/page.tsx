import Assessment from "./avaliacao/page";

export default function Home(){
  return <>
    <Assessment/>
    <a className="admin-corner" href="/admin" aria-label="Acesso administrativo" title="Acesso administrativo">•••</a>
  </>;
}
