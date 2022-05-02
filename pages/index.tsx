import Head from 'next/head'
import Header from '../components/Header'
import Link from 'next/link'
import Moment from 'react-moment'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typing'

interface Props {
  posts: [Post]
}

const Home = ({ posts }: Props) => {
  return (
    <div>
      <Head>
        <title>BlogSanity</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <section>
        <div className="border-y border-black bg-yellow-400">
          <div className="mx-auto flex max-w-7xl items-center justify-between py-10 lg:py-0">
            <div className="space-y-5 px-10">
              <h1 className="max-w-xl text-6xl font-[400]">Stay curious.</h1>
              <h2 className="text-xl">
                Discover stories, thinking, and expertise from writers on any
                topic.
              </h2>
              <h3
                className="w-fit cursor-pointer rounded-full bg-gray-900 px-12 py-2 text-lg 
            text-white transition duration-100 hover:bg-gray-800"
              >
                Start reading
              </h3>
            </div>
            <div className="hidden md:inline-block">
              <img src="/svg/hero.svg" className="w-full" />
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="mx-auto max-w-7xl p-5">
          {posts.map((post) => (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="mx-auto flex max-w-3xl cursor-pointer items-center space-x-2 py-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 pb-1">
                    <img
                      src={urlFor(post.author.image).url()!}
                      alt=""
                      className="h-6 w-6 rounded-full"
                    />
                    <p className="text-xs">{post.author.name}</p>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold md:text-xl">
                      {post.title}
                    </h1>
                    <p className="hidden text-gray-500 md:inline-flex">
                      {post.description}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">
                      <Moment format="ll">{post._createdAt}</Moment>
                    </span>
                  </div>
                </div>
                <div>
                  <img
                    src={urlFor(post.mainImage).url()!}
                    alt=""
                    className="h-auto w-24 md:w-48"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    title,
    description,
    author -> {
    name,
    image
  },
  mainImage,
  slug
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
