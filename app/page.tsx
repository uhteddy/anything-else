import Link from "next/link"

export default function Home() {
  return (
    <>
      <div className="navbar border-b">
        <div className="navbar-start">
          Anything Else
        </div>
        <div className="navbar-center tabs tabs-border">
          <Link href="/.." className="tab tab-active">Home</Link>
          <Link href="/../docs" className="tab">Documentation</Link>
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="tab">Project Assignments</div>
            <ul tabIndex={-1} className="dropdown-content menu bg-base-100">
              <li><Link href="" className="tab">Assignment 1</Link></li>
              <li><Link href="" className="tab">Assignment 2</Link></li>
              <li><Link href="" className="tab">Assignment 3</Link></li>
              <li><Link href="" className="tab">Assignment 4</Link></li>
              <li><Link href="" className="tab">Assignment 5</Link></li>
            </ul>
          </div>
          <Link href="/../game" className="tab">Play Now</Link>
          <Link href="/../about_us" className="tab">About Us</Link>
        </div>
        <div className="navbar-end">
          <a href="https://github.com/uhteddy/anything-else">Github</a>
        </div>
      </div>
    </>
  );
}
