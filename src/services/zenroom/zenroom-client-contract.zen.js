export default `
Scenario 'ecdh': create keypair from data

# Loading the user name from data
Given my name is in a 'string' named 'username'

# Loading the answers from 3 secret questions. The user will have to pick the 3 challenges from a list 
# and have to remember the questions - the order is not important cause Zenroom will sort alphabetically 
# the data in input
#
# NOTE: the challenges will never be communicated to the server or to anybody else!
Given I have a 'string dictionary' named 'userChallenges'

# Loading the pbkdf received from the server, containing a signed hash of known data
Given that I have a 'string' named 'key_derivation'  

# Loading the individual challenges, in order to have them hashed 
# and the hashes OPTIONALLY stored by the server, to improve regeneration of the keypair
Given I have a 'string' named 'question1' in 'userChallenges'
Given I have a 'string' named 'question2' in 'userChallenges'
Given I have a 'string' named 'question3' in 'userChallenges'
Given I have a 'string' named 'question4' in 'userChallenges'
Given I have a 'string' named 'question5' in 'userChallenges'


# Hashing the user's challenges and renaming it
When I create the hash of 'userChallenges'
and I rename the 'hash' to 'userChallenges.hash'

# appending the user challenges' hash to the pbkdf, hashing the result and renaming it 
When I append 'userChallenges.hash' to 'key_derivation'
When I create the hash of 'key_derivation'
and I rename the 'hash' to 'concatenatedHashes'

# Creating the keypair from the hash just created
When I create the keypair with secret key 'concatenatedHashes'

When I create the 'base64 dictionary'
and I rename the 'base64 dictionary' to 'hashedAnswers'


# Creating the hashes of the single challenges, to OPTIONALLY help 
# regeneration of the keypair

When I create the hash of 'question1'
and I rename the 'hash' to 'question1.hash'
When I insert 'question1.hash' in 'hashedAnswers'

When I create the hash of 'question2'
and I rename the 'hash' to 'question2.hash'
When I insert 'question2.hash' in 'hashedAnswers'

When I create the hash of 'question3'
and I rename the 'hash' to 'question3.hash'
When I insert 'question3.hash' in 'hashedAnswers'

When I create the hash of 'question4'
and I rename the 'hash' to 'question4.hash'
When I insert 'question4.hash' in 'hashedAnswers'

When I create the hash of 'question5'
and I rename the 'hash' to 'question5.hash'
When I insert 'question5.hash' in 'hashedAnswers'

Then print my 'keypair'

# Comment the line below, if you don't want to output the hashes of the challenges
Then print 'hashedAnswers'
`;