import { PromptSubmitProvider } from "@/context/PromptSubmitContext"
import PageLayout from "@/components/PageLayout";
import Results from "@/components/search/Results";
export default function Home(){
  //extract the params and put in the search topbar 
  return(
    <>
      <PromptSubmitProvider>
        <PageLayout>
          <Results/>
        </PageLayout>
      </PromptSubmitProvider>
    </>
  )
}