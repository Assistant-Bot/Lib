# Message style for commits.
All commits should have the following style: `<emoji>(file?): Description`. An example:
> 🎉 feature: Voice channel support! <br />
> 📝 chore(test.ts): Fix a few types

### Chores
**Name:** chore <br/>
**Prefix:** 📝<br/>
**Descrption:** A chore can include, a minor fix, and audit, or something that involves repitition.

### Features
**Name:** feature<br/>
**Prefix:** 🎉<br/>
**Description:** This commit implements a new feature.

### Release
**Name:** release<br/>
**Prefix:** 🚀<br/>
**Description:** This commit releases a new version of the project.

### Deprecation
**Name:** deprecate<br/>
**Prefix:** 😒<br/>
**Description:** This commit audits a method or property that is now deprecated and may be removed in the future.

### Tests
**Name:** test<br/>
**Prefix:** 🧪<br/>
**Description:** A test can include a piece of code that performs a functional check on the project.

### Create
**Name:** create<br/>
**Prefix:** 🆕<br/>
**Description:** This commit creates a file or (related). **SHOULD NOT** be used for feature implementation.

### Removal or Deletion
**Name:** delete<br/>
**Prefix:** 🗑<br/>
**Description:** This commit removes one or multiple files.

### Bulk
**Name:** bulk<br/>
**Prefix:** 🛒<br/>
**Description:** Includes a bulk amount of changes.

### Merge
**Name:** merge<br/>
**Prefix:** 📩<br/>
**Description:** This commit merges a branch into another (or related).