import os
import sys
import string

import gi
from gi.repository import Gtk

def main():

    gladeFile = 'dobutsu_shogi_ui.glade'

    builder = Gtk.Builder()
    builder.add_from_file(gladeFile)
    window = builder.get_object('applicationwindow1')
    window.show_all()

    Gtk.main()

if __name__ == '__main__':
    main()
