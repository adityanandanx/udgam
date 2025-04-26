import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useCreateIdeaForm } from "./hooks/use-create-idea";

const CreateIdeaForm = () => {
  const { form, onSubmit, isPending } = useCreateIdeaForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mt-3"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idea title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="My awesome idea" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="short_desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe your idea in brief</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="A robot which takes over the earth with a ..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="base_idea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base idea</FormLabel>
              <FormControl>
                <Input {...field} placeholder="A very intelligent robot" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="self-end" disabled={isPending}>
          Create
        </Button>
      </form>
    </Form>
  );
};

export default CreateIdeaForm;
