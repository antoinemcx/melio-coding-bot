module.exports = async (client, thread) => {
    try {
        /* Join the created thread if possible */
        if (thread.joinable) {
            await thread.join();
        }
    } catch(e) {
        console.log(e);
    }
}