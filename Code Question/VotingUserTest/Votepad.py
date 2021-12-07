# Write your code here :-)
class Votepad:

    def __init__(self,ID, ind, sensor, color, date, nrVotes):
        self.ID = ID
        self.ind = ind
        self.sensor = sensor
        self.color = color
        self.date = date
        self.nrVotes = nrVotes

    def addVote(self):
        self.nrVotes = self.nrVotes + 1
