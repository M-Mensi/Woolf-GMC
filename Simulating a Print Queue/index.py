class Queue:
    def __init__(self):
        self._items = []

    def enqueue(self, item):
        self._items.append(item)

    def dequeue(self):
        if self.is_empty():
            print("dequeue from empty queue")
        return self._items.pop(0)

    def peek(self):
        if self.is_empty():
            print("peek from empty queue")
        return self._items[0]

    def is_empty(self):
        return len(self._items) == 0

    def __len__(self):
        return len(self._items)


class PrinterQueue:
    """Manages print jobs using a FIFO queue."""
    def __init__(self):
        self.queue = Queue()

    def add_job(self, name, pages):
        """Add a new print job to the queue."""
        job = {"name": name, "pages": pages}
        self.queue.enqueue(job)
        print(f"Job added: {name} ({pages} pages)")

    def process_job(self):
        """Process (remove) the next job in the queue."""
        if self.queue.is_empty():
            print("No jobs to process.")
            return
        job = self.queue.dequeue()
        print(f"Processing job: {job['name']} ({job['pages']} pages)")

    def print_queue(self):
        """Display all jobs currently waiting in the queue."""
        if self.queue.is_empty():
            print("The queue is empty.")
        else:
            print("Current print queue:")
            for idx, job in enumerate(self.queue._items):
                print(f"  {idx+1}. {job['name']} ({job['pages']} pages)")


# ---------- Test the implementation ----------
if __name__ == "__main__":
    printer = PrinterQueue()

    # Add some jobs
    printer.add_job("Report.docx", 5)
    printer.add_job("Presentation.pptx", 10)
    printer.add_job("Invoice.pdf", 2)

    # Show the queue
    printer.print_queue()

    # Process one job
    printer.process_job()

    # Show the updated queue
    printer.print_queue()

    # Process remaining jobs
    printer.process_job()
    printer.process_job()

    # Final queue state
    printer.print_queue()